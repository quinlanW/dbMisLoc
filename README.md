# dbMisloc

> [dbMisLoc: A Manually Curated Database of Conditional Protein Mis-localization Events](https://link.springer.com/article/10.1007/s12539-023-00564-0#citeas)

## Introduction

We store all the protein exception location information in a MySQL database. We used the node.js scripting engine and JavaScript from the Express framework to implement the backend system. The frontend was implemented using JavaScript with the Vue framework. We developed the project on the **MacOS platform** using the code editor [Visual Studio Code](https://code.visualstudio.com/).

## Development

If you want to run this code in your development environment, you should first install **Node.js** (https://nodejs.org/en/download) and **MySQL** (https://www.mysql.com/downloads/) on your machine.

After your Node.js environment and MySQL are ready, find out the location of your unpacked dbMisloc source code and enter the 'server' and 'web' directories in the command line program. Execute the command `npm install` separately to install all the dependencies of the project.

### Add data to MySQL database

Firstly, you should create a database. Then, add data to the database by loading SQL file dbmisloc.sql.

### Install Blast

Visit **Blast.ncbi**(https://blast.ncbi.nlm.nih.gov/Blast.cgi) to download the Blast installer

### Start backend

Enter the `server` directory in another command line program. In order to start the backend, the users need to modify the configuration file under 'server/config' path to configure MySQL database information, namely **connect.json**. Then execute the command `nodemon . /bin/www` or `npm run start`.

### start web server

Enter the `web` directory in another command line program. Execute the command `npm run serve`.

## Citation

[1] Wang, RH., Luo, T., Guo, YP. *et al.* dbMisLoc: A Manually Curated Database of Conditional Protein Mis-localization Events. *Interdiscip Sci Comput Life Sci* (2023). https://doi.org/10.1007/s12539-023-00564-0
