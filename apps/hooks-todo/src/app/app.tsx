import React, { Component } from 'react';
import './app.scss';
import {Route, withRouter} from 'react-router-dom';
import auth0Client from './Auth';
import NavBar from './NavBar';
import Callback from './Callback';
import Question from './q_and_a/Question';
import Questions from './q_and_a/Questions';
import NewQuestion from './q_and_a/NewQuestion';
import SecuredRoute from './q_and_a/SecuredRoute';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true,
    }
  }

  async componentDidMount() {
    if (this.props.location.pathname === '/callback') {
      this.setState({checkingSession:false});
      return;
    }
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
    this.setState({checkingSession:false});
  }

  render() {
    return (
      <div>
        <NavBar/>
        <Route exact path='/' component={Questions}/>
        <Route exact path='/question/:questionId' component={Question}/>
        <Route exact path='/callback' component={Callback}/>
        <SecuredRoute path='/new-question'
                      component={NewQuestion}
                      checkingSession={this.state.checkingSession} />
      </div>
    );
  }
}

export default withRouter(App);

// Hooks todo app
// import React, { useState } from "react";
// import './app.scss';
// // create a component that we can use in the return of the main App component
// function Todo({ todo, index, completeTodo, removeTodo, selectTodo }) {
//   return (
//     <div className="todo"
//       style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}>
//       <div onClick={() => selectTodo(index)}>{todo.text}</div>
//       <div>
//         <button onClick={() => completeTodo(index)}>Complete</button>
//         <button className="removeTodo" onClick={() => removeTodo(index)}>X</button>
//       </div>
//     </div>
//   );
// }
//
// function TodoForm({ addTodo }) {
//   // Start with an empty state
//   const [value, setValue] = useState("");
//   const handleSubmit = e => { e.preventDefault();
//     if (!value) return;
//     addTodo(value);
//     setValue("");
//   };
//   return (<form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         className="input"
//         value={value}
//         onChange={e => setValue(e.target.value)}/>
//     </form>);
// }
//
// function App() {
//   const [todo, setTodo] = useState({});
//   const [todos, setTodos] = useState([
//      { text: "Learn about React",
//        isCompleted: false },
//      { text: "Meet friend for lunch",
//        isCompleted: false },
//      { text: "Build really cool todo app",
//        isCompleted: false }]);
//   const addTodo = text => {
//     // this.state is implied in certain places.
//     const newTodos = [...todos, { text }];
//     setTodos(newTodos);
//   };
//   const completeTodo = index => {
//     const newTodos = [...todos];
//     newTodos[index].isCompleted = !newTodos[index].isCompleted;
//     setTodos(newTodos);
//   };
//   const removeTodo = index => {
//    const newTodos = [...todos];
//    newTodos.splice(index, 1);
//    setTodos(newTodos);
//   };
//   const selectTodo = index => {
//     console.log('chosen',todos[index])
//     setTodo(todos[index]);
//   };
//   return (
//     <div className="app">
//       <div className="todo-list">
//         {/* create a new array of items by mapping over the
//          todo items from state and displaying them by index. */}
//         {todos.map((todo, index) => (
//           <Todo
//             key={index}
//             index={index}
//             todo={todo}
//             completeTodo={completeTodo}
//             removeTodo={removeTodo}
//             selectTodo={selectTodo}
//           />
//         ))}
//         <TodoForm addTodo={addTodo} />
//         <div className="selectedTodo">{todo.text}</div>
//       </div>
//     </div>
//   );
// }
// export default App;
