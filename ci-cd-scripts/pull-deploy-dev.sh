cd /home/ubuntu/workbattle-backend
git checkout dev
git pull origin dev
docker rm $(docker stop $(docker ps -q --filter ancestor=workbattle/backend))
docker rmi workbattle/backend
docker build -t workbattle/backend .
docker run -p 80:3000 -d workbattle/backend