import { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineDone, MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { API_URL } from "./api.js";

function App() {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const getTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/todos`);
      setTodos(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/todos`, {
        description,
        completed: false,
      });
      setDescription("");
      getTodos();
    } catch (err) {
      console.error(err.message);
    }
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/todos/${id}`, {
        description: editedText,
      });
      setEditingTodo(null);
      setEditedText("");
      getTodos();
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const toggleCompleted = async (id) => {
    try {
      const todo = todos.find((todo) => todo.todo_id === id);
      await axios.put(`${API_URL}/todos/${id}`, {
        description: todo.description,
        completed: !todo.completed,
      });
      setTodos(
        todos.map((todo) =>
          todo.todo_id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4 text-white">
      <div className="bg-gray-700 p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="flex justify-center text-3xl font-molded text-blue-400">
          Organizer
        </h1>
        <form onSubmit={onSubmitForm}>
          <input
            className="w-full p-3 mt-4 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a new todo"
            required
          />
          <button className="w-full p-3 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer">
            Add Task
          </button>
        </form>
        <div>
          {todos.length === 0 ? (
            <p className="text-center mt-4 text-gray-400">No tasks available</p>
          ) : (
            <div className="flex flex-col gap-y-4 mt-6">
              {todos.map((todo) => (
                <div key={todo.todo_id} className="pb-4">
                  {editingTodo === todo.todo_id ? (
                    <div className="flex items-center gap-x-3">
                      <input
                        className="flex-1 p-3 border rounded-lg border-gray-500 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner text-white"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <div>
                        <button
                          onClick={() => saveEdit(todo.todo_id)}
                          className="px-4 py-2 mt-2 bg-green-500 text-white rounded-lg mr-2 mt-2 hover:bg-green-600 duration-200 hover:cursor-pointer"
                        >
                          <MdOutlineDone />
                        </button>
                        <button
                          onClick={() => setEditingTodo(null)}
                          className="
                          px-4 py-2 mt-2 bg-gray-500 text-white rounded-lg mr-2 mt-2 hover:bg-gray-600 duration-200 hover:cursor-pointer"
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-x-4 overflow-hidden">
                        <button
                          onClick={() => toggleCompleted(todo.todo_id)}
                          className={` flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center ${todo.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-blue-4000"}`}
                        >
                          {todo.completed && <MdOutlineDone size={16} />}
                        </button>
                        <span>{todo.description}</span>
                      </div>
                      <div className="ml-auto flex gap-x-2">
                        <button
                          onClick={() => {
                            setEditingTodo(todo.todo_id);
                            setEditedText(todo.description);
                          }}
                          className="p-3 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"
                        >
                          <MdModeEditOutline />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.todo_id)}
                          className="p-3 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
