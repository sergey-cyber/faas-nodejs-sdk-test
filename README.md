# faas-sdk for Node.js

SDK основанный на [Express](https://expressjs.com/) для разработки функций на NodeJS, выполняемых в среде Platform V Functions.

### Quickstart:

1. Создайте `package.json`, используя команду `npm init -y`

2. Создайте файл `index.js` с функцией:
   
```js
    exports.handler = (req, res) => {
       let message = req.query.message || req.body.message || "Hello from Function";
       res.status(200).send(message);
    };
```
       
3. Установите faas-sdk-nodejs используя npm:

```sh
    npm install https://dzo.sw.sbc.space/bitbucket-ci/scm/faas/faas-sdk-nodejs.git
```
4. Добавьте скрипт `start` в файл `package.json` с нужными конфигурациями:

```
  "scripts": {
    "start": "faas-sdk-nodejs --target=handler"
  }
```
   
5. Используйте `npm start`:
   
```sh
    npm start
    ...
    Function: handler
    🚀 Function ready at http://localhost:8082
```
       
6. Отправьте запрос используя `curl`, браузер или другие инструменты:

```sh
    curl localhost:8082
    # Output: Hello from Function
```
   
## Конфигурация

Вы можете конфигурировать faas-sdk-nodejs с помощью флагов командной строки или
переменных среды:

| Флаг        | Переменные среды  |По умолчанию | Описание                                                                 |
| ------------| ------------------|-------------| -------------------------------------------------------------------------|
| `--port`    | `PORT`            |8082         | Порт для faas-sdk-nodejs.                                                |
| `--target`  | `FUNCTION_TARGET` |handler      | Имя экспортируемой функции, которая будет вызываться при запросах.       |
| `--source`  | `FUNCTION_SOURCE` |Корень папки | Путь к каталогу вашей функции.                                           |

Можете добавить в скрипт `start` необходимые команды, например: 

```
  "scripts": {
    "start": "faas-sdk-nodejs --target=your_function_name --source=./src"
  }
```
    
Также необходимо указывать путь к файлу с вашей функцией в `package.json`, например:

```
    "main": "handler.js"
```
Если это не указано, по умолчанию будет взят index.js находящийся в директории, указанной в --source или в переменной среды.     
