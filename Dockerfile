FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=1234
ENV MYSQL_DATABASE=staywise

COPY ./backend/setup_database.sql /docker-entrypoint-initdb.d/

EXPOSE 3306