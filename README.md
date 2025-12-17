# SEED

SEED is a smart retail management system that helps businesses track sales, manage inventory, monitor expenses, and make data-driven decisions—all in one clean, efficient dashboard.

docker build -t seed-server -f Dockerfile .

docker stop seed && docker rm seed

docker run -d -p 8080:8080 --name seed --env-file server/.env seed-server

docker logs -f seed
