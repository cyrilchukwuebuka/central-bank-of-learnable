# 🏦 CENTRAL BANK OF LEARNABLE  

**Central Bank of Learnable** is a banking service platform that makes online banking seamless for their customers.  

## BACKEND API ENDPOINTS  
Data can be fetched with any kind of methods you know (fetch API, Axios, ...)  
The following endpoints are available from the API perspective.  

## Home Route  
````
curl -X GET  http://localhost:8800/api/
````

## Admin Endpoints  
#### Register as Admin  
Request Example:
```
curl -X POST \
  -H 'Content-Type: application/json' \
  http://localhost:8800/api/admin/register \
  -d '{
    "username": "Cyril",
    "firstName": "Cyril",
    "lastName": "Chukwuebuka",
    "tel": "08138678993",
    "email": "cyrilchuks@gmail.com",
    "password": "123456"
}'
````
Response

````
"Admin registration was successful"
````

#### Login as Admin
Request Example:
```
curl -X POST \
  -H 'Content-Type: application/json' \
  http://localhost:8800/api/admin/login \
  -d '{
    "email": "cyrilchuks@gmail.com",
    "password": "123456"
}'
````
Response  
_Admin token_
````
{
  "authentication-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"  
}
````

#### Delete User  
Only logged in Admin with verified authentication token can perform this function  

Request Example:
```
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'authentication-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' \
  http://localhost:8800/api/admin/delete/:userAccount 
````
Response  
_returns json of deleted user_
````
    {
        "username": "Cyril",
        "firstName": "Cyril",
        "lastName": "Chukwuebuka",
        "email": "cyrilchuks@gmail.com",
        "tel": "08138678993",
        "password": "...",
        "balance": 0,
        "transactionId": ...,
        "account": "...",
        "isAccountDisabled": false,
        "credit": [],
        "debit": [],
        "_id": "...",
        "date": "2021-12-14T16:14:28.607Z",
        "createdAt": "2021-12-14T16:14:28.619Z",
        "updatedAt": "2021-12-14T16:14:28.619Z",
        "__v": 0
    }
````

#### Get all registered User  
Only logged in Admin with verified authentication token can perform this function  

Request Example:
```
curl -X GET \
  -H 'Content-Type: application/json' \
  -H 'authentication-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' \
  http://localhost:8800/api/admin/users
````
Response  
_Returns list of registered user object_
````
[
    [
        {
        "username": "Cyril",
        "firstName": "Cyril",
        "lastName": "Chukwuebuka",
        "email": "cyrilchuks@gmail.com",
        "tel": "08138678993",
        "password": "...",
        "balance": 0,
        "transactionId": ...,
        "account": "...",
        "isAccountDisabled": false,
        "credit": [],
        "debit": [],
        "_id": "...",
        "date": "2021-12-14T16:14:28.607Z",
        "createdAt": "2021-12-14T16:14:28.619Z",
        "updatedAt": "2021-12-14T16:14:28.619Z",
        "__v": 0
    },
    {
      ...
    },
    ...
    ]
]
````

#### Disable User (De-activate User)  
Only logged in Admin with verified authentication token can perform this function  

Request Example:
```
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'authentication-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' \
  http://localhost:8800/api/admin/deactivate-account/:userAccount
````
Response  
````
"The account <userAccount> has been disabled"
````

#### Enable User (Re-activate User)  
Only logged in Admin with verified authentication token can perform this function  

Request Example:
```
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'authentication-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' \
  http://localhost:8800/api/admin/reactivate-account/:userAccount
````
Response  
````
"The account <userAccount> has been reactivated"
````

#### Reverse Transaction (Transfer)  
Only logged in Admin with verified authentication token can perform this function  

Request Example:
```
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'authentication-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' \
  http://localhost:8800/api/admin/reactivate-account/:userAccount
````
Response  
````
"The account <userAccount> has been reactivated"
````



## Auth Endpoints
#### Add User (Register User)
Only logged in Admin with verified authentication token can perform this function  

Request Example:
```
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'authentication-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' \
  http://localhost:8800/api/auth/register \
  -d '{
    "username": "Cyril",
    "firstName": "Cyril",
    "lastName": "Chukwuebuka",
    "tel": "08138678993",
    "email": "cyrilchuks@gmail.com",
    "password": "123456"
}'
````
Response  
_returns json of registered user_
````
    {
        "username": "Cyril",
        "firstName": "Cyril",
        "lastName": "Chukwuebuka",
        "email": "cyrilchuks@gmail.com",
        "tel": "08138678993",
        "password": "...",
        "balance": 0,
        "transactionId": ...,
        "account": "...",
        "isAccountDisabled": false,
        "credit": [],
        "debit": [],
        "_id": "...",
        "date": "2021-12-14T16:14:28.607Z",
        "createdAt": "2021-12-14T16:14:28.619Z",
        "updatedAt": "2021-12-14T16:14:28.619Z",
        "__v": 0
    }
````

#### Login as a User
Request Example:
```
curl -X POST \
  -H 'Content-Type: application/json' \
  http://localhost:8800/api/auth/login \
  -d '{
    "email": "cyrilchuks@gmail.com",
    "password": "123456"
}'
````
Response  
_User token_
````
{
    "authentication-token": "axJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}
````




## User Endpoints  
__Check for account disable in the workflow











