var fs = require("fs");
var exec = require('child_process').exec;
let randomStr = require('string-random'); // new
let mysql = require("../repositories/protein").Mysql();
let Parser = require("json2csv").Parser;
let json2csvParser = new Parser();

//blast
const blast_binPath = '' //'/usr/local/ncbi/blast/bin' 

const tempPath_query = '/Users/quinlan/Desktop/dbmisloc/server/blast/temp/' 
const tempPath_result='/Users/quinlan/Desktop/dbmisloc/server/blast/temp/'   

const db_path = '/Users/quinlan/Desktop/dbmisloc/server/blast/misblastdb/misblastdb' 

exports.getblastresult= function(req, res, next) {
    if (
        typeof req.body.seqquery == "undefined" ||
        typeof req.body.sizequery == "undefined"
    ) {
        res.status(400);
        res.send({
            error: true,
            message: "post参数缺失(seqquery, sizequery)",
        });
        return;
    }else{
        let inputfile;
        let outputfile;

        if(req.cookies.input==null){
            // console.log("!!!!");
            inputfile = randomStr();  
            outputfile = randomStr();  
            res.cookie("input",inputfile,{maxAge: 900000, httpOnly: true});  
            res.cookie("output",outputfile,{maxAge: 900000, httpOnly: true});  
        // console.log(req.cookies);
        }else{
            inputfile = req.cookies.input;
            outputfile = req.cookies.output;
        }
        
        // Store the request sequence of the front-end in a file
        var seq_query = req.body.seqquery;
        var sizequery = req.body.sizequery.toString();
        var wordsize = req.body.wordsize.toString();

        var path_query = tempPath_query + inputfile + '.fasta';
        var path_result = tempPath_result + outputfile + '.txt';
        fs.writeFileSync(path_query, seq_query); 
        fs.writeFileSync(path_result,"");   
        // Calling the command line test
        
        var cmd = blast_binPath+'blastp -query '+path_query+
                  ' -out '+path_result+
                  ' -db '+db_path+
                  ' -outfmt "6 qseqid sseqid pident length evalue bitscore"'+
                  ' -evalue '+sizequery+
                  ' -word_size '+wordsize+' -num_threads 1';
        exec(cmd, function(error, stdout, stderr) {
            // Read test results
            let data = fs.readFileSync(path_result, "utf8").split('\n'); 
        
            // Send to front-end
             res.send({
                error: false,
                message: {
                    num: 0,
                    info: error,stdout,stderr,
                    data:data
                },
            });
            fs.close;
            fs.unlinkSync(path_query);
            fs.unlinkSync(path_result);
            return;
        });
    }
}

exports.getProteinsAll = function (req, res, next) {
    mysql.form("ptmis_table").where("num_id", "0", ">=").select(function (err, data) {
        if (err) {
            console.log("get all protein err")
            res.status(500).send({
                error: true,
                message: "服务器内部错误",
            });
            return;
        }
        res.send({
            error: false,
            message: {
                num: data.length,
                info: data,
            },
        });
        return;
    });
};

exports.getProteinsByKeyValue = function (req, res, next) {
    if (
        typeof req.query.type == "undefined" ||
        typeof req.query.value == "undefined"
    ) {
        console.log("get protein without params")
        res.status(400);
        res.send({
            error: true,
            message: "get参数缺失(type、value)",
        });
        return;
    } else {
        mysql.form("ptmis_table")
            .where("protein", req.query.type, "=")
            .where("Normal_localization", req.query.type, "=", "or")
            .where("Mislocalization", req.query.type, "=", "or")
            .where("Normal_localization_GO_ID", req.query.value, "=", "and")
            .where("Mislocalization_GO_ID", req.query.value, "=", "or")
            .select(function (err, data) {
                if (err) {
                    res.status(500).send({
                        error: true,
                        message: "服务器内部错误",
                    });
                }
                res.send({
                    error: false,
                    message: {
                        num: data.length,
                        info: data,
                    },
                });
                return;
            });
    }
};

exports.getProteins = function (req, res, next) {
    if (
        typeof req.body.perPage == "undefined" ||
        typeof req.body.page == "undefined"
    ) {
        res.status(400);
        res.send({
            error: true,
            message: "post参数缺失(perPage, page)",
        });
        return;
    } else {
        let sql = mysql.form("ptmis_table");
        let prop, val, op, rel;
        if (typeof req.body.conditions != "undefined") {
            // Conditional queries
            for (index in req.body.conditions) {
                let condition = req.body.conditions[index];
                [prop, val, op, rel] = [
                    condition.prop,
                    condition.val,
                    condition.op,
                    condition.rel,
                ];
                sql = sql.where(prop, val, op, rel).setBinary(false);
            }
        }
        
        // Return information by page
        sql.limit(req.body.perPage * req.body.page + req.body.perPage)
            .orderBy("num_id")
            .select(function (err, data) {
                if (err) {
                    res.status(500).send({
                        error: true,
                        message: "服务器内部错误",
                    });
                } else {
                    let st = req.body.perPage * req.body.page - req.body.perPage,
                        ed;
                    if (st >= data.length) {
                        //No data on the requested page
                        res.send({
                            error: false,
                            message: {
                                num: 0,
                                info: [],
                            },
                        });
                        return;
                    } else if (
                        req.body.perPage * req.body.page >=
                        data.length
                    ) {
                        //The requested page data is not filled
                        ed = data.length;
                    } else {
                        //The requested page is filled with data
                        ed =
                            req.body.perPage * req.body.page;
                    }
                    let resArr = data.slice(st, ed);
                    res.send({
                        error: false,
                        message: {
                            num: ed - st,
                            info: resArr,
                        },
                    });
                    return;
                }
            });
    }
};

exports.getProteinsFile = function(req, res, next) {
    mysql.form("ptmis_table").where("num_id", "0", ">=").select(function (err, data) {
        if (err || typeof data == "undefined") {
            res.status(500).send({
                error: true,
                message: "服务器内部错误",
            });
            return;
        }
        let csv = json2csvParser.parse(data);
        res.set({
            'Content-Type': 'application/octet-stream; charset=utf-8',
            'Content-Disposition': 'attachment; filename=' + 'proteins'+'.csv',
            'Content-Length': csv.length
          });
        res.send(csv);
        return;
    });
}

