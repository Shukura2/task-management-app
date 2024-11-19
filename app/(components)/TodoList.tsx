import React from "react";
import { capitalizeFirstLetter, TodoListType } from "./utility";

const TodoList = ({
  list,
  handleAddNotification,
  openModal,
  deleteTask,
  formatDate,
  readMore,
  setReadMore,
  handleDragStart,
  handleDragOver,
  handleDrop,
  index,
}: TodoListType) => {
  return (
    <div
      key={list.id}
      className="mb-7 shadow bg-white py-3 px-4"
      draggable
      onDragStart={() => handleDragStart(index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDrop={handleDrop}
    >
      <div className=" flex justify-between items-center">
        <h2 className=" font-bold capitalize">{list.title}</h2>
        <div className=" flex gap-3 items-center">
          <p>{formatDate(list.dueDate)}</p>
          <button
            className={`${list.notify ? "fade" : "no-fade"}`}
            onClick={() => handleAddNotification(list)}
          >
            <i className="fa-solid fa-bell bg-purple-400 text-xl font-bold p-2 rounded-full"></i>
          </button>
        </div>
      </div>

      <div>
        {list.additionalNote.length < 500 ? (
          <p>{capitalizeFirstLetter(list.additionalNote)}</p>
        ) : (
          <p>
            {readMore
              ? capitalizeFirstLetter(list.additionalNote)
              : capitalizeFirstLetter(
                  `${list.additionalNote.substring(0, 500)}...`
                )}
            <span>
              <button
                onClick={() => setReadMore(!readMore)}
                className=" text-blue-500 text-sm font-bold"
              >
                {readMore ? "Read less" : "Read more"}
              </button>
            </span>
          </p>
        )}
      </div>

      <div className=" flex justify-between items-center group">
        <div className=" flex gap-3 ">
          <button
            onClick={() => openModal(list)}
            className="bg-purple-400 text-xl font-bold px-2 py-1 rounded-md"
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>

          <button
            onClick={() => deleteTask(list.id)}
            className="bg-red-500 text-xl font-bold px-2 py-1 rounded-md"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>

        <div>{list.status}</div>
      </div>
    </div>
  );
};

export default TodoList;
