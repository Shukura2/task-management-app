import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { TodoInputsType } from "./utility";
import {
  validateAdditionalNote,
  validateDueDate,
  validateTitle,
} from "./formikValidation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { ModalProps } from "./utility";

const Modal = ({
  isOpen,
  closeModal,
  todoInputs,
  inputType,
  setInputType,
  todoLists,
  setTodoLists,
}: ModalProps) => {
  const [isProcessingUpdate, setIsProcessingUpdate] = useState<boolean>(false);

  const handleUpdate = async (values: TodoInputsType) => {
    setIsProcessingUpdate(true);
    try {
      const taskDoc = doc(db, "tasks", values.id);
      await updateDoc(taskDoc, {
        title: values.title,
        additionalNote: values.additionalNote,
        dueDate: values.dueDate,
        status: values.status,
        notify: values.notify,
      });
      const task = {
        id: values.id,
        title: values.title,
        additionalNote: values.additionalNote,
        dueDate: values.dueDate,
        status: values.status,
        notify: values.notify,
      };

      const updatedTask = todoLists.map((list) =>
        list.id === values.id ? task : list
      );
      setTodoLists(updatedTask);
      setIsProcessingUpdate(false);
      closeModal();
    } catch (error) {
      throw error;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 left-0 top-0 bottom-0 bg-dark flex justify-center items-center z-[1]">
      <div className="w-[70%] bg-white p-5 relative rounded shadow-shadowRgb">
        <div className="flex justify-end">
          <button onClick={closeModal}>
            <i className="fa-solid fa-xmark text-red-500 text-xl"></i>
          </button>
        </div>

        <Formik initialValues={todoInputs} onSubmit={handleUpdate}>
          {({ errors, touched }) => (
            <Form>
              <div className="mb-3">
                <label className="font-bold">Title:</label>
                <Field
                  name="title"
                  placeholder="Title"
                  className="input-style"
                  validate={validateTitle}
                />
                {errors.title && touched.title && (
                  <div className="text-red-500 text-xs">{errors.title}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="font-bold">Additional note:</label>
                <Field
                  name="additionalNote"
                  placeholder="Additional note"
                  className="input-style"
                  validate={validateAdditionalNote}
                />
                {errors.additionalNote && touched.additionalNote && (
                  <div className=" text-red-500 text-xs">
                    {errors.additionalNote}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="font-bold">Due Date:</label>
                <Field
                  name="dueDate"
                  placeholder="Select due date"
                  className="input-style"
                  validate={validateDueDate}
                  type={inputType}
                  onFocus={() => setInputType("datetime-local")}
                  onBlur={() => setInputType("text")}
                />
                {errors.dueDate && touched.dueDate && (
                  <div className="text-red-500 text-xs">{errors.dueDate}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="font-bold">Status:</label>
                <Field
                  as="select"
                  name="status"
                  placeholder="Select due date"
                  className="input-style"
                  validate={validateDueDate}
                  type={inputType}
                  onFocus={() => setInputType("datetime-local")}
                  onBlur={() => setInputType("text")}
                >
                  <option>pending</option>
                  <option>completed</option>
                </Field>
                {errors.dueDate && touched.dueDate && (
                  <div className=" text-red-500 text-xs">{errors.dueDate}</div>
                )}
              </div>

              <button
                type="submit"
                className={`${
                  isProcessingUpdate
                    ? "cta-noactive bg-purple-800 text-white font-bold px-2 py-1 rounded-md"
                    : "cta-active bg-purple-800 text-white font-bold px-2 py-1 rounded-md"
                }`}
              >
                {isProcessingUpdate ? "Processing" : "Save"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Modal;
