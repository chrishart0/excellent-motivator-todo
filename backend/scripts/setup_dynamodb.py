import boto3

# Initialize a boto3 client for DynamoDB

dynamodb = boto3.resource(
    'dynamodb',
    endpoint_url="http://dynamodb-local:8000",  # Use Docker service name as hostname
)


# Create the DynamoDB table
table = dynamodb.create_table(
    TableName='ToDoItems',
    KeySchema=[
        {'AttributeName': 'id', 'KeyType': 'HASH'},  # Partition key
    ],
    AttributeDefinitions=[
        {'AttributeName': 'id', 'AttributeType': 'S'},
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 10,
        'WriteCapacityUnits': 10
    }
)

# Wait for the table to be created
table.meta.client.get_waiter('table_exists').wait(TableName='ToDoItems')
print("Table created successfully.")
