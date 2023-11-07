import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('dataAccessLayer/todosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.INDEX_NAME
    ) { }

    // function get all todo
    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Step1: Start call function get all todos')
        logger.info(`Get get all todos for user ${userId} from ${this.todosTable} table.`)

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
            .promise()

        const items = result.Items
        logger.info(`Step2: Find ${items.length} todos for the user with UserId: ${userId} in ${this.todosTable} table.`)
        logger.info('Step3: End functuin get all todos.')
        return items as TodoItem[]
    }

    // function create todo
    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('Step1: Start call function create todos.')
        logger.info(`Putting todo ${todoItem.todoId} into ${this.todosTable} table.`)

        const result = await this.docClient
            .put({
                TableName: this.todosTable,
                Item: todoItem
            })
            .promise()
        logger.info('Step2: Create Toto items.', result)
        logger.info('Step3: End call function create todos.')
        return todoItem as TodoItem
    }

    // function update todo
    async updateTodoItem(todoId: string, userId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {
        logger.info('Step1: Start call function update todos.')
        logger.info(`Step2: Update todo item with ID: ${todoId} in ${this.todosTable} table.`)

        const result = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ":name": todoUpdate.name,
                ":dueDate": todoUpdate.dueDate,
                ":done": todoUpdate.done
            },
            ReturnValues: 'ALL_NEW'
        }).promise()
        const updateItem = result.Attributes
        logger.info('Step3: End call function update todos item.', updateItem)
        return updateItem as TodoUpdate
    }

    //  function delete item for todo
    async deleteTodoItem(todoId: string, userId: string): Promise<string> {
        logger.info('Step1: Start call function delete todos.')
        logger.info(`Step2: Delete todo item with ID: ${todoId} from ${this.todosTable} table.`)

        const result = await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        }).promise()
        logger.info('Step3: Todo deleted item', result)
        logger.info('Step4: End call function delete todos.')
        return todoId as string
    }
}