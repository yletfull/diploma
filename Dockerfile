# Stage 1: Build Stage
# Используем официальный образ Node.js на базе Ubuntu для сборки проекта
FROM node:14 AS build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь остальной исходный код в рабочую директорию
COPY . .

# Собираем проект
RUN npm run build

# Stage 2: Production Stage
# Используем официальный образ Node.js на базе Alpine для запуска приложения
FROM node:14-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем только необходимые файлы из предыдущего build stage
COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist

# Устанавливаем production зависимости
RUN npm install --only=production

# Открываем порт 3000 для доступа к приложению (если ваше приложение слушает на этом порту)
EXPOSE 3000

# Запускаем приложение
CMD ["node", "dist/index.js"]
