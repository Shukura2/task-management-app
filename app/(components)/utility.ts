import React from "react";

export interface TodoInputsType {
  id: string;
  title: string;
  additionalNote: string;
  dueDate: string;
  status: string;
  notify?: boolean;
}

export interface SessionType {
  user: {
    name: string;
  };
}

export interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  todoInputs: TodoInputsType;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  inputType: string;
  setInputType: React.Dispatch<React.SetStateAction<string>>;
  todoLists: TodoInputsType[];
  setTodoLists: React.Dispatch<React.SetStateAction<TodoInputsType[]>>;
}

export interface TodoListType {
  list: TodoInputsType;
  handleAddNotification: (values: TodoInputsType) => Promise<void>;
  openModal: (task: TodoInputsType) => void;
  deleteTask: (id: string) => Promise<void>;
  formatDate: (dateTime: string) => string;
  readMore: boolean;
  setReadMore: React.Dispatch<React.SetStateAction<boolean>>;
  handleDragStart: (index: number) => void;
  handleDragOver: (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => void;
  handleDrop: () => void;
  index: number;
}

export const scheduleNotification = (task: TodoInputsType) => {
  const dateString = new Date(task.dueDate).getTime();
  const timeStamp = Date.now();
  const delay = dateString - timeStamp;

  if (delay > 0) {
    setTimeout(() => {
      new Notification("Task Reminder", {
        body: `time to complete ${task.title}`,
      });
    }, delay);
  }
};

export const userName = (session: SessionType) => {
  let name = session.user.name.split(" ")[0];
  let names = name.charAt(0).toUpperCase() + name.substring(1);
  return names;
};

export const formatDate = (dateTime: string) => {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${hour}:${minute} / ${day}-${month}-${year}`;
};

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
