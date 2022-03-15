<template>
    <div class="bbody" style="height: 100vh; overflow-x: hidden">
        <el-row class="title" style="color: #606060;">
            <img style="margin-right: 5px; margin-bottom: 5px; height: 45px; width: auto; vertical-align: middle;" src="../assets/img/blast_label.png" />
                Blast
        </el-row>
        <div class="myForm" >
            <!-- Form  -->
            <el-input class="RNAinput" type="textarea" rows="10" placeholder="Enter the query protein sequence(FASTA)" v-model="textarea" clearable></el-input>
            <div class="middle" style="margin-top: 20px">
                <b>e-value: </b>
                <el-select v-model="evalue" clearable @change="evalue_change" style="margin: 0 20px 0 10px">
                <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <b>word size: </b>
                <el-input v-model="word_size" placeholder="integer in [2,7]" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
                <el-button class="sou" type="success" v-on:click="Search(evalue,word_size)" style="margin-left: 10px; padding-left: 10px;" icon="el-icon-search" plain>Blast</el-button>
                <el-button class="sou" type="prime" v-on:click="SearchExample()"   plain>Example</el-button>
                <el-table :data="tableData" v-show="show" style="width: 100%; margin: 20px auto 0 auto" stripe strip highlight-current-row empty-text="..." border>
                  
                  <!-- <el-table-column  label="Query sequence id" prop="qseqid" width="270"></el-table-column> -->
                  <el-table-column  label="Subject seq id" prop="sseqid" width="230"></el-table-column>
                  <el-table-column  label="Percentage(identical matches)" prop="pident" width="250"></el-table-column>
                  <el-table-column  label="Alignment length" prop="length" width="200"></el-table-column>
                  <el-table-column  label="Evalue" prop="evalue"></el-table-column>
                  <el-table-column  label="Bitscore" prop="bitscore"></el-table-column>

                  <el-table-column prop="" label="Details" type="expand" width="90">
                    <template slot-scope="props">
                        <el-form label-position="left" class="demo-table-expand" label-width="auto" style="font-family: monospace;">
                            <el-form-item label="Protein">
                                <span>{{ props.row.protein }}</span>
                            </el-form-item>
                            <el-form-item label="Uniprot ID">
                                <span>{{ props.row.UID }}</span>
                            </el-form-item>
                            <el-form-item label="Uniprot AC">
                                <span>{{ props.row.UAC }}</span>
                            </el-form-item>
                            <el-form-item label="Normal localization">
                                <span>{{ props.row.norloc }}</span>
                            </el-form-item>
                            <el-form-item label="Mislocalization">
                                <span>{{ props.row.misloc }}</span>
                            </el-form-item>
                            <el-form-item label="Normal localization GO">
                                <span>{{ props.row.norGO }}</span>
                            </el-form-item>
                            <el-form-item label="Mislocalization GO">
                                <span>{{ props.row.misGO }}</span>
                            </el-form-item>
                            <el-form-item label="Mislocalization condition">
                                <span>{{ props.row.condition }}</span>
                            </el-form-item>
                            <el-form-item label="Protein sequence">
                                <span>{{ props.row.sequence }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                </el-table>
            </div>
        </div>
        <template>
          <el-backtop target=".bbody" :visibility-height="100" :bottom="40">
            <div
              style="{
                height: 100%;
                width: 100%;
                background-color: #151D3B;
                box-shadow: 0 0 6px rgba(0,0,0, .12);
                text-align: center;
                line-height: 40px;
                color: #EFFFFD;
              }"
            >
              <img 
                style="height: 20px; width: auto; vertical-align: middle;"
                src="../assets/img/backtotop.png" alt=""
              >
            </div>
          </el-backtop>
        </template> 
    </div>
</template>

<script>
import request from '@/utils/request'
import { getProteinData } from "@/api/dataReq.js"
import { showLoading, hideLoading } from '../assets/js/loading.js' //

export default {
    data() {
        return {
            example: '>sp|Q9BQA1|MEP50_HUMAN Methylosome protein 50 OS=Homo sapiens OX=9606 GN=WDR77 PE=1 SV=1\nMRKETPPPLVPPAAREWNLPPNAPACMERQLEAARYRSDGALLLGASSLSGRCWAGSLWL\nFKDPCAAPNEGFCSAGVQTEAGVADLTWVGERGILVASDSGAVELWELDENETLIVSKFC\nKYEHDDIVSTVSVLSSGTQAVSGSKDICIKVWDLAQQVVLSSYRAHAAQVTCVAASPHKD\nSVFLSCSEDNRILLWDTRCPKPASQIGCSAPGYLPTSLAWHPQQSEVFVFGDENGTVSLV\nDTKSTSCVLSSAVHSQCVTGLVFSPHSVPFLASLSEDCSLAVLDSSLSELFRSQAHRDFV\nRDATWSPLNHSLLTTVGWDHQVVHHVVPTEPLPAPGPASVTE',
            textarea: '',
            show:false,
            word_size:'2',
            // Set the evalue drop-down box option
            options1: [
                {
                value: '1e-4',
                label: '1e-4'
                }, {
                value: '1e-3',
                label: '1e-3'
                },{
                value: '1e-5',
                label: '1e-5 '
                },{
                value: '1e-6',
                label: '1e-6 '
                },{
                value: '1e-7',
                label: '1e-7 '
                },],
            // Set the default value of evalue
            evalue: '1e-4',
            tableData:[],
            // seq:[],
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        evalue_change(val) {
            this.evalue = val;
        },
        Search(evalue,word_size){
            this.tableData = [];
            showLoading();
            this.show = true;
            request({    
                url: "/api/proteins/getblastresult",
                method: "POST",
                data:{
                    seqquery:this.textarea,
                    sizequery:evalue,
                    wordsize:word_size
                },
            })
            .then(res=>{
                console.log(res)  
                if(res.message.data.length == 1){
                  hideLoading();
                  window.alert("Blast Query is Empty!")
                }      
                for(let i=0;i<res.message.data.length;i++){
                  let resdata = res.message.data[i];
                  if(resdata!==""){
                    let qseqid = resdata.split('\t')[0];
                    let sseqid = resdata.split('\t')[1];
                    let pident = resdata.split('\t')[2];
                    let length = resdata.split('\t')[3];
                    let evalue = resdata.split('\t')[4];
                    let bitscore = resdata.split('\t')[5];
                    let result = {}
                    let param ={
                      "perPage":1,
                      "page":1,
                      "conditions": [{
                        "prop": "Nucleotide_Sequences_FASTA",
                        "op": "like",
                        "val": '%'+sseqid+'%',
                      }]
                    };
                    getProteinData(param).then(
                      res=>{
                        // console.log(res.message.info[0]);
                        let protein = res.message.info[0]['Protein'];
                        let seq = res.message.info[0]['Nucleotide_Sequences_FASTA'];
                        let norloc = res.message.info[0]['Normal_localization'];
                        let misloc = res.message.info[0]['Mislocalization'];
                        let cond = res.message.info[0]['Mislocalization_conditions'];
                        let norGO = res.message.info[0]['Normal_localization_GO_ID'];
                        let misGO = res.message.info[0]['Mislocalization_GO_ID'];
                        let UID = res.message.info[0]['Uniprot_Entry'];
                        let UAC = res.message.info[0]['Uniprot_Accession_number'];
                        
                        result = {
                            "qseqid": qseqid,
                            "sseqid": sseqid,
                            "pident": pident,
                            "length": length,
                            "evalue": evalue,
                            "bitscore": bitscore,
                            "sequence": seq,
                            "norloc": norloc,
                            "misloc": misloc,
                            "protein": protein,
                            "condition": cond,
                            "norGO": norGO,
                            "misGO": misGO,
                            "UID": UID,
                            "UAC": UAC
                          }
                          this.tableData.push(result)
                          hideLoading();  
                      },
                      err=>{
                        console.log(err)
                        hideLoading();
                      }
                    )
                    
                  }
                }
            })
            .catch(err=>{
                console.log(err);
            })
        },
        SearchExample(){
            this.textarea = this.example;
            // this.tableData = [];
            // this.show = true;   
        }
    }
}
</script>

<style>
/* .el-table__expand-icon:after{
  content: "More";
  color: #1526df;
}
.el-table__expand-icon >i{
  display: none !important;
} */
</style>
<style scoped>
.el-select{
  width: 150px !important;
}
.el-input{
  width: 150px;
}
.el-select-dropdown__item{
  text-align: center !important;
}
</style>
<style scoped lang="less">
.myForm {
  margin: 10px auto; /* Form centering settings */
  padding: 40px 60px;
  width: 75%;
  border: 3px solid #00B4D8;
  border-radius: 10px;
}

.el-table {
  font-size: 15px;
  white-space: pre-line;
  //color: #232324;
}
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
/deep/ .el-form-item__label {
  font-size: 15px;
  //color: #232324;
}

.title {
  text-align: center;
  font-size: 1.5em;
  line-height: 80px;
  height: 80px;
  background: #e6f0ef; /* Old browsers */
  background: -moz-linear-gradient(
    200deg,
    #9AD0EC 60%,
    #398AB9 80%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    200deg,
    #9AD0EC 60%,
    #398AB9 80%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    200deg,
    #9AD0EC 60%,
    #398AB9 80%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#9AD0EC', endColorstr='#398AB9',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
}

.el-form-item {
  border-top: 1px solid #ebeef5; 
  margin-bottom: 0;
}

// .el-form-item /deep/ .el-form-item__label {
//   border-right: 1px solid #ebeef5;
// }

// .el-form-item:nth-child(7) /deep/ .el-form-item__label {
//   height: 80px;
// }
// .el-form-item:nth-child(7) /deep/ .el-form-item__content {
//   margin-top: 15px;
// }
// /deep/  
/deep/ .el-input__inner:hover {
  // background-color: rgb(115, 200, 200) !important;
  border-color: rgb(115, 200, 200) !important;
}

/deep/ .el-input .is-active .el-input__inner.el-input__inner:focus {
  border-color: rgb(115, 200, 200) !important;
}

/deep/ .el-radio__inner:hover {
  background-color: rgb(115, 200, 200) !important;
  border-color: rgb(115, 200, 200) !important;
}
/deep/ .all_label {
  display: inline-grid;
  white-space: pre-line;
  word-wrap: break-word;
  overflow: hidden;
  line-height: 20px;
}
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: rgb(115, 200, 200) !important;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: rgb(115, 200, 200) !important;
  border-color: rgb(115, 200, 200) !important;
}
/deep/ .el-checkbox__label {
  padding-left: 5px;
}
/deep/ .el-radio__input.is-checked + .el-radio__label {
  color: rgb(115, 200, 200) !important;
}
/deep/ .el-radio__input.is-checked .el-radio__inner {
  background-color: rgb(115, 200, 200) !important;
  border-color: rgb(115, 200, 200) !important;
}
/deep/ .el-radio__label {
  padding-left: 5px;
  font-size: 15px;
  color: #232324;
}
/deep/ .el-textarea__inner {
  border-color: #398AB9 !important;
  font-size: 15px;
  color: #000000;
}
/deep/ .el-select .el-input__inner:focus {
  border-color: #398AB9;
}

.el-select {
  margin-left: 10px;
}

.el-select-dropdown__item.selected {
  color: #00B4D8;
}

.el-select-dropdown__item {
  text-align: center;
  text-indent: 0;
}

.sou{
  background-color: #ffffff;
}
// /deep/ .el-input {
//   width: 60%;
//   margin-left: 10px;
//   font-size: 15px;
// }

// /deep/ .el-input .el-input__inner:focus {
//   border-color: rgb(115, 200, 200);
// }

.upload {
  height: 35px;
  line-height: 35px;
  //   position: relative;
  font-size: 15px;
  width: 100px;
  border-radius: 5px;
  color: #fff;
  background-color: #5cb85c;
  margin: auto 30px;
  outline: none;
  cursor: pointer;
}


.change {
  position: absolute;
  overflow: hidden;
  width: 100px;
  line-height: 35px;
  left: 30px;
  top: 20px;
  opacity: 0; 
  cursor: pointer;
}

.submit {
  font-size: 15px;
  height: 35px;
  width: 120px;
  border-radius: 5px;
  color: #fff;
  background-color: #337ab7;
  border: #337ab7;
  margin: auto 10px; 
  outline: none;
  cursor: pointer;
}

.myemail {
  font-size: 15px;
  height: 35px;
  width: 120px;
  border-radius: 5px;
  color: #fff;
  background-color: #e6a23c;
  border: #e6a23c;
  margin: 10px 10px 10px; 
}

.progress-wrap {
  width: 100%;
  margin: 0 auto;
  // border-left: 1px solid #ebeef5;
  p {
    margin: 0 auto;
    width: 100%;
    font-size: 15px;
  }
  .progress {
    background-color: #c5c8ce;
    height: 15px;
    span {
      display: block;
      background-color: #19be6b;
      height: 100%;
      width: 0;
    }
  }
}
</style>
<style lang="scss" scoped>

::v-deep .el-form-item__label {
  float: none; // Cancel label left float
  word-break: break-word; // Support word truncation line feed
}
::v-deep .el-table__expand-icon{
 -webkit-transform: rotate(0deg);
 transform: rotate(0deg);
}
</style>