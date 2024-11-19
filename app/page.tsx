"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Formik, Form, Field } from "formik";
import Modal from "./(components)/Modal";
import {
  validateTitle,
  validateAdditionalNote,
  validateDueDate,
} from "./(components)/formikValidation";
import ImageIcon from "./public/image-icon.png";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config/firebase";
import TodoList from "./(components)/TodoList";
import {
  scheduleNotification,
  TodoInputsType,
  userName,
  formatDate,
} from "./(components)/utility";

const Home = () => {
  const [inputType, setInputType] = useState<string>("text");
  const [todoInputs, setTodoInputs] = useState<TodoInputsType>({
    id: "",
    title: "",
    additionalNote: "",
    dueDate: "",
    status: "pending",
    notify: false,
  });
  const [todoLists, setTodoLists] = useState<TodoInputsType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [readMore, setReadMore] = useState<boolean>(false);
  const tasksCollectionRef = collection(db, "tasks");
  const [loading, setLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");
  const [draggingIndex, setDraggingIndex] = useState<null | number>(null);
  const [isSignin, setIsSignIn] = useState<boolean>(false);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const { data: session } = useSession();

  const handleSubmit = async (
    values: TodoInputsType,
    { resetForm }: { resetForm: () => void }
  ) => {
    setIsProcessing(true);
    try {
      const docRef = await addDoc(tasksCollectionRef, {
        title: values.title,
        additionalNote: values.additionalNote,
        dueDate: values.dueDate,
        status: values.status,
        notify: values.notify,
      });

      const newTask = {
        id: docRef.id,
        title: values.title,
        additionalNote: values.additionalNote,
        dueDate: values.dueDate,
        status: values.status,
        notify: values.notify,
      };

      setTodoLists((prev) => [...prev, newTask]);
      setIsProcessing(false);
      resetForm();
    } catch (error) {
      throw Error;
    }
  };

  const getTasksList = async () => {
    setLoading(true);
    try {
      const data = await getDocs(tasksCollectionRef);
      const lists = data.docs.map((doc) => {
        const taskData = doc.data();

        return {
          id: doc.id,
          title: taskData.title,
          additionalNote: taskData.additionalNote,
          dueDate: taskData.dueDate,
          status: taskData.status,
          notify: taskData.notify,
        } as TodoInputsType;
      });
      setTodoLists(lists);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const showPendingTasks = () => setFilter("pending");
  const showCompletedTasks = () => setFilter("completed");

  const filteredTasks =
    filter === "all"
      ? todoLists
      : todoLists?.filter((task) => task.status === filter);

  const deleteTask = async (id: string) => {
    try {
      const filterTask = todoLists?.filter((todoList) => todoList.id !== id);
      setTodoLists(filterTask);
      const taskDoc = doc(db, "tasks", id);
      await deleteDoc(taskDoc);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getTasksList();
  }, []);

  const handleAddNotification = async (values: TodoInputsType) => {
    if (!values.id) {
      return;
    }

    setTodoLists((prevTasks) =>
      prevTasks.map((task) =>
        task.id === values.id ? { ...task, notify: !task.notify } : task
      )
    );

    const taskDoc = doc(db, "tasks", values.id);
    await updateDoc(taskDoc, { notify: !values.notify });

    const task = todoLists?.find((task) => task.id === values.id);
    if (task && !task.notify) {
      scheduleNotification(task);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTodoInputs({ ...todoInputs, [name]: value });
  };

  const openModal = (task: TodoInputsType) => {
    setTodoInputs(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setTodoInputs({
      title: "",
      additionalNote: "",
      dueDate: "",
      status: "",
      id: "",
    });
    setIsModalOpen(false);
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;
    const updatedItems = [...todoLists];
    const [draggedItems] = updatedItems.splice(draggingIndex, 1);
    updatedItems.splice(index, 0, draggedItems);
    setDraggingIndex(index);
    setTodoLists(updatedItems);
  };

  const handleDrop = () => {
    setDraggingIndex(null);
  };

  return (
    <div className="max-w-[1440px] mx-auto flex justify-center relative">
      <div
        onClick={() => setIsSignIn(!isSignin)}
        className={`absolute top-4 right-10 cursor-pointer group`}
      >
        {session ? (
          <div className=" relative flex items-center justify-center">
            <Image
              src={`${session.user.image}`}
              alt=""
              className="  rounded-full"
              width={28}
              height={28}
            />
            <span className=" absolute top-full mt-2 w-max p-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {userName(session)}
            </span>
          </div>
        ) : (
          <div className=" bg-slate-300 w-7 h-7 rounded-full flex justify-center items-center">
            <Image
              src={ImageIcon}
              width={28}
              height={28}
              alt=""
              className=" rounded-full"
            />
          </div>
        )}
      </div>

      <div className=" absolute top-[20px] right-[80px]">
        {isSignin && session && (
          <button onClick={() => signOut()}>Signout</button>
        )}
      </div>

      <div className=" absolute top-[50px] right-5">
        {isSignin && !session && (
          <button onClick={() => signIn()}>Signin</button>
        )}
      </div>

      <div className="md:w-[50%]">
        <div className="bg-white mt-8 p-4 md:p-6">
          <p className=" text-2xl md:text-4xl font-bold text-center text-purple-800 mb-5">
            Task Management App
          </p>
          <Formik initialValues={todoInputs} onSubmit={handleSubmit} resetForm>
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
                    <div className=" text-red-500 text-xs">{errors.title}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="font-bold">Additional note:</label>
                  <Field
                    as="textarea"
                    name="additionalNote"
                    placeholder="Additional note"
                    className="input-style textarea"
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
                    <div className=" text-red-500 text-xs">
                      {errors.dueDate}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className={`${
                    isProcessing
                      ? "cta-noactive bg-purple-800 text-white font-bold px-2 py-1 rounded-md"
                      : "cta-active bg-purple-800 text-white font-bold px-2 py-1 rounded-md"
                  }`}
                >
                  {isProcessing ? "Processing" : "Submit"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          todoInputs={todoInputs}
          handleChange={handleChange}
          inputType={inputType}
          setInputType={setInputType}
          todoLists={todoLists}
          setTodoLists={setTodoLists}
        />

        <div className="mt-5 p-6">
          {loading ? (
            <>
              <p>Loading...</p>
            </>
          ) : (
            <>
              {todoLists.length > 0 ? (
                <>
                  <div className=" flex gap-4 justify-end items-center mb-9">
                    <p className=" italic font-bold">Filter by: </p>
                    <div className=" flex gap-3">
                      <button
                        onClick={showPendingTasks}
                        className="bg-yellow-500 font-bold py-1 px-3 capitalize rounded-md"
                      >
                        pending
                      </button>
                      <button
                        onClick={showCompletedTasks}
                        className="bg-green-600 font-bold py-1 px-3 capitalize rounded-md"
                      >
                        completed
                      </button>
                    </div>
                  </div>

                  {filteredTasks?.map((list, index) => (
                    <TodoList
                      key={list?.id}
                      list={list}
                      index={index}
                      handleAddNotification={handleAddNotification}
                      openModal={openModal}
                      deleteTask={deleteTask}
                      formatDate={formatDate}
                      readMore={readMore}
                      setReadMore={setReadMore}
                      handleDragStart={handleDragStart}
                      handleDragOver={handleDragOver}
                      handleDrop={handleDrop}
                    />
                  ))}
                </>
              ) : (
                <p>No todo yet</p>
              )}

              {todoLists.length > 0 && (
                <button
                  onClick={() => setTodoLists([])}
                  className="bg-red-500 text-xl text-white px-2 py-1 rounded-md"
                >
                  Clear all
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
