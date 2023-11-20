import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField
} from "@mui/material";
import Alert, { AlertColor } from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import ITask from "../../types/TaskType";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { taskDataService } from "../../services/TaskDataService";
import { useAuth } from "../context/AuthContext";

const TasksList: React.FC = () => {
  const {user} = useAuth();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const navigate = useRef(useNavigate());

  const [taskToDelete, setTaskToDelete] = useState<ITask | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editedTaskDescription, setEditedTaskDescription] = useState<string | null>(null);

  const [newElement, setNewElement] = useState("");

  type ProgressAlertType = AlertColor | undefined;
  const [showProgressAlert, setShowProgressAlert] = useState(false);
  const [progressAlertType, setProgressAlertType] = useState<ProgressAlertType>(undefined);
  const [progressAlertMessage, setProgressAlertMessage] = useState('');

  const PROGRESS_ALERT_DURATION = 3000;
  const ENTER_KEY = 'Enter';

  useEffect(() => {
    if (user !== null) {
      retrieveTasks();
    } else {
      navigate.current('/login');
    }
  }, [user]);

  const addNewTask = async (): Promise<void> => {
    if (newElement.trim() !== "") {
      // Generate temp task id for pending task
      const tempTaskId = tasks.reduce((maxId, task) => Math.max(maxId, task.id), -1) + 1;

      const newTask = {
        id: tempTaskId,
        description: newElement,
        completed: false,
        loading: true
      };

      setTasks((prevTasks) => [...prevTasks, newTask]); // Use the callback form
      setNewElement("");

      try {
        const response = await taskDataService.create({
          description: newTask.description,
          completed: false
        });

        setProgressAlertMessage('Task saved successfully');
        setProgressAlertType('success');
        setShowProgressAlert(true);

        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((task) => {
            if (task.id === tempTaskId) {
              // Update the task with the response ID and set loading to false
              return { ...task, id: response.data.id, loading: false };
            }
            return task;
          });

          setTimeout(() => {
            setShowProgressAlert(false);
          }, 3000);

          return updatedTasks;
        });
      } catch (error) {
        console.error(error);
        setProgressAlertMessage('Task save failed');
        setProgressAlertType('error');
        setShowProgressAlert(true);

        setTasks((prevTasks) => {
          // Remove the task from the UI since there was an error
          const updatedTasks = prevTasks.filter((task) => task.id !== tempTaskId);

          setTimeout(() => {
            setShowProgressAlert(false);
          }, PROGRESS_ALERT_DURATION);

          return updatedTasks;
        });
      }
    }
  };

  const handleEdit = (task: ITask) => {
    setEditTaskId(task.id);
    setEditedTaskDescription(task.description);
  };

  const saveEditedTask = async () => {
    if (!editTaskId || !editedTaskDescription) {
      return;
    }

    try {
      const updatedTaskIndex = tasks.findIndex(task => task.id === editTaskId);

      if (updatedTaskIndex !== -1) {
        const updatedTask = {...tasks[updatedTaskIndex], description: editedTaskDescription};
        const response = await taskDataService.update(updatedTask);
        console.log(response);

        // Update the tasks state with the updated task
        setTasks(prevTasks => {
          const newTasks = [...prevTasks];
          newTasks[updatedTaskIndex] = updatedTask;
          return newTasks;
        });
      } else {
        console.error("Task not found with ID:", editTaskId);
      }

      // Reset editTaskId and editedTaskDescription
      setEditTaskId(null);
      setEditedTaskDescription(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleTextFieldKeyPress = (event: React.KeyboardEvent) => {
    event.preventDefault();
    if (event.key === ENTER_KEY) {
      saveEditedTask();
    }
  };

  const handleDelete = (task: ITask) => {
    setTaskToDelete(task);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      const updatedTasks = tasks.filter((task) => task.id !== taskToDelete.id);
      setTasks(updatedTasks);
      setOpenDeleteDialog(false);

      taskDataService.delete(taskToDelete.id)
        .then((response) => {
          console.log(response);
          console.log('Successfully deleted task with id' + taskToDelete.id);
        })
        .catch((error) => {
          console.error("Error retrieving tasks:", error);
        });
    }
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
    setOpenDeleteDialog(false);
  };

  const toggleTaskCompleted = async (taskId: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );

      const updatedTask = updatedTasks.find((task) => task.id === taskId);

      if (updatedTask) {
        taskDataService.update(updatedTask)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.error("Error updating task:", error);
            // Handle the error as needed
          });

        return updatedTasks;
      }

      return prevTasks;
    });
  };

  const retrieveTasks = () => {
    taskDataService.getAll()
      .then((response) => {
        setTasks(response);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error retrieving tasks:", error);
      });
  };

  return (
    <Container sx={{ mt: 2 }}>
      {/* Progress Indicator */}
      <Box sx={{ height: '48px' }}>
        {showProgressAlert && (
          <Alert severity={progressAlertType} sx={{ mt: 2 }}>
            {progressAlertMessage}
          </Alert>
        )}
      </Box>
      {/*New Task Input */}
      <TextField
        variant="outlined"
        fullWidth
        label="New task"
        value={newElement}
        onChange={(e) => setNewElement(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            addNewTask();
          }
        }}
        sx={{ mt: 2 }}
        helperText="Press Enter to save the task"
      />
      <List sx={{ width: '100%', mt: 2 }}>
        {tasks
          .slice() // Create a shallow copy of the array to avoid modifying the original array
          .sort((a, b) => a.id - b.id) // Sort tasks based on ID in ascending order
          .map((task: ITask) => (
            <React.Fragment key={task.id}>
              <ListItem key={task.id}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  disableRipple
                  onChange={() => toggleTaskCompleted(task.id)}
                />
              </ListItemIcon>
              {editTaskId === task.id ? (
                  <TextField
                    variant="standard"
                    sx={{width: '100%'}}
                    value={editedTaskDescription ?? ''}
                    onChange={(e) => setEditedTaskDescription(e.target.value)}
                    onBlur={saveEditedTask}
                    onKeyUp={handleTextFieldKeyPress}
                  />
              ) : (
                <ListItemText primary={task.description} sx={{ mr: 4 }} />
              )}
              <ListItemSecondaryAction>
                {editTaskId !== task.id && (
                  <IconButton edge="end" onClick={() => handleEdit(task)} sx={{ m: 1 }}>
                    <EditIcon/>
                  </IconButton>
                )}
                <IconButton edge="end" onClick={() => handleDelete(task)}>
                  <DeleteIcon/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
              {task.loading ? (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                </Box>
              ): null}
            <Divider/>
          </React.Fragment>
        ))}
      </List>
      <Dialog
        open={openDeleteDialog}
        onClose={cancelDelete}
      >
        <DialogTitle id="delete-task-dialog-title">Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-task-dialog-description">
            Are you sure you want to delete the task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} variant="outlined">Cancel</Button>
          <Button onClick={confirmDeleteTask} autoFocus color={"error"} variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TasksList;
