import { TodosAccess } from '../dataAccessLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
//import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAcess = new TodosAccess()

// function create Todo
export async function createTodo(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info("Start handle create todo function")
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: s3AttachmentUrl,
        ...newTodo
    }

    return await todosAcess.createTodoItem(newItem)
}

// fucntion update Todo
export async function updateTodo(
    todoId: string,
    todoUpdate: UpdateTodoRequest,
    userId: string): Promise<TodoUpdate> {
    logger.info('Start handle update todo function')
    return todosAcess.updateTodoItem(todoId, userId, todoUpdate)
}

// function delete Todo
export async function deleteTodo(
    todoId: string,
    userId: string): Promise<string> {
    logger.info('Start handle delete todo function')
    return todosAcess.deleteTodoItem(todoId, userId)
}

// function get Toto by user
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Start handle get todo for user function')
    return todosAcess.getAllTodos(userId)
}

//function create attachment for Todo
export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    logger.info('Start handle create attachment presigned url function by: ', userId, todoId)
    return attachmentUtils.getUploadUrl(todoId)
}