import Feedback from '../../../models/enterprise/form/feedback.js';
import Form from '../../../models/enterprise/form/form.js';
import Question from '../../../models/enterprise/form/question.js';

class FormController {
    async createForm(createdBy, company, name, description = '') {
        const templateQuestions = {
            questionText: 'Untitled Question 1',
            questionType: 'Multiple Choice',
            options: [{ optionText: 'Option 1' }],
        };

        const question = new Question(templateQuestions);

        const form = new Form({
            createdBy,
            name,
            description: description === '' ? 'No description' : description,
            company,
            questions: [question],
        });

        await question.save();
        await form.save();

        return form;
    }

    async updateForm(form) {
        const inActiveQuestions = await Form.findById(form._id)
            .populate('questions')
            .then((form) => form.questions.filter((question) => question.active === false));

        const active = [];
        const inactive = inActiveQuestions.map((question) => question._id.toString());

        const uniqueQuestions = await Feedback.aggregate([
            { $unwind: '$responses' },
            {
                $group: {
                    _id: '$responses.question',
                },
            },
            {
                $project: {
                    _id: '$_id',
                },
            },
        ]);

        for (const question of form.questions) {
            //Update question

            //Add question
            if (question.snapshot.new) {
                const copy = { ...question };
                //remove attribute _id in options where option._id is start with 'new'
                copy.options = copy.options.map((option) => {
                    if (option._id.startsWith('new')) {
                        // eslint-disable-next-line no-unused-vars
                        const { _id, ...rest } = option; // Destructure _id from the option object
                        return rest; // Return the object without the _id property
                    }
                    return option; // Keep the original object as it is if _id doesn't start with "new"
                });

                delete copy._id;
                delete copy.snapshot;

                const newQuestion = await Question.create(copy);
                active.push(newQuestion._id.toString());
            } else if (
                question.snapshot.setting ||
                (question.snapshot.modify && !uniqueQuestions.some((item) => item._id.equals(question._id)))
            ) {
                const copy = { ...question };
                //remove attribute _id in options where option._id is start with 'new'
                copy.options = copy.options.map((option) => {
                    if (option._id.startsWith('new')) {
                        // eslint-disable-next-line no-unused-vars
                        const { _id, ...rest } = option; // Destructure _id from the option object
                        return rest; // Return the object without the _id property
                    }
                    return option; // Keep the original object as it is if _id doesn't start with "new"
                });

                delete copy._id;
                delete copy.snapshot;

                await Question.updateOne({ _id: question._id }, { $set: copy });
                active.push(question._id.toString());
            } else if (question.snapshot.delete) {
                //Set question to inactive
                if (question.snapshot.feedback) {
                    await Question.updateOne({ _id: question._id }, { $set: { active: false } });
                    inactive.push(question._id.toString());
                }
                //Delete question
                else {
                    await Question.deleteOne({ _id: question._id });
                }
            } else if (question.snapshot.modify && uniqueQuestions.some((item) => item._id.equals(question._id))) {
                const copy = { ...question };

                //Old question set to inactive
                await Question.updateOne({ _id: question._id }, { $set: { active: false } });
                inactive.push(question._id.toString());

                //remove attribute _id in options where option._id is start with 'new'
                copy.options = copy.options.map((option) => {
                    if (option._id.startsWith('new')) {
                        // eslint-disable-next-line no-unused-vars
                        const { _id, ...rest } = option; // Destructure _id from the option object
                        return rest; // Return the object without the _id property
                    }
                    return option; // Keep the original object as it is if _id doesn't start with "new"
                });

                delete copy._id;
                delete copy.snapshot;

                const newQuestion = await Question.create(copy);
                active.push(newQuestion._id.toString());
            } else {
                active.push(question._id.toString());
            }
        }

        //Update form
        const allQuestions = [...active, ...inactive];

        await Form.findByIdAndUpdate(
            form._id,
            {
                name: form.name,
                description: form.description,
                setting: form.setting,
                questions: allQuestions,
            },
            { new: true },
        );

        return true;
    }

    async deleteForm(id) {
        const form = await Form.findById(id);
        const questions = form.questions;

        //Delete all questions
        await Question.deleteMany({ _id: { $in: questions } });

        //Delete all feedbacks
        await Feedback.deleteMany({ form: id });

        await Form.findByIdAndRemove(id);
    }

    async getFormsByUser(userId) {
        const forms = await Form.find({
            $or: [{ createdBy: userId }, { collaborator: userId }],
        })
            .populate('createdBy', 'firstName lastName')
            .populate('collaborator', 'firstName lastName')
            .lean()
            .then((forms) =>
                forms.map((form) => {
                    form.collab = form.createdBy._id.equals(userId) ? false : true;
                    return form;
                }),
            );

        return forms;
    }

    async getFormByIdWithSnapshot(id) {
        const form = await Form.findById(id)
            .populate('createdBy', 'firstName lastName')
            .populate('collaborator', 'firstName lastName')
            .populate({ path: 'questions', match: { active: true } })
            .lean();

        const uniqueQuestions = await Feedback.aggregate([
            { $unwind: '$responses' },
            {
                $group: {
                    _id: '$responses.question',
                },
            },
            {
                $project: {
                    _id: '$_id',
                },
            },
        ]);

        // Check if form and its questions exist
        if (form && form.questions) {
            // Loop through each question in the questions array
            form.questions.forEach((question) => {
                // Add 'new' and 'change' properties with values 'false'
                question.snapshot = {
                    new: false,
                    modify: false,
                    setting: false,
                    delete: false,
                    // Check if question is in Feedback
                    feedback: uniqueQuestions.some((item) => item._id.equals(question._id)),
                };
            });
        }

        return form;
    }

    async getPublishFormsByCompany(companyId, userId) {
        const forms = await Form.find({ company: companyId, 'setting.published': true });

        const listPublishForms = forms.map((form) => {
            const done = form.employeeDone.includes(userId);
            return {
                _id: form._id,
                name: form.name,
                description: form.description,
                setting: {
                    once: form.setting.once,
                    dueDate: form.setting.dueDate,
                },

                done,
            };
        });

        return listPublishForms;
    }

    async getPublishFormById(id) {
        const form = await Form.findById(id)
            .populate({ path: 'questions', match: { active: true } })
            .lean();

        return form;
    }

    async submitForm(id, userId, responses) {
        await Feedback.create({
            form: id,
            responses,
        });

        //push employee to employeeDone if not exist
        await Form.updateOne({ _id: id }, { $addToSet: { employeeDone: userId } });

        return true;
    }

    async getFeedbacksByFormId(id) {
        const feedbacks = await Feedback.find({ form: id }).populate('responses.question').lean();

        const form = await Form.findById(id);

        const formAndFeedback = {
            name: form.name,
            description: form.description,
            feedbacks,
        };

        return formAndFeedback;
    }
}

export default FormController;
