<template>
  <div >
    <el-row class="title" style="color: #606060;">
      <img
        src="../assets/img/download_label.png"
        style="height: 40px; width: auto;  vertical-align: middle; margin-right: 10px;"
      />
      Download files
    </el-row>
    <div class="files" style="">
      <h3>dbMisLoc Data Description</h3>
      <div class="download-content" style="height: 80%">
          <!-- <img src="../assets/img/download_icon.png" class="icon" /> -->
        <!-- <span style="margin: auto;"> -->
          <div style="margin: 30px;">
            <span>
              The downloadable file contains all the data in the dbMisLoc database. 
            <!-- </span>
            <br><br>
            <span> -->
              It contains the corresponding name of the protein, normal localization, 
              mislocalization, mislocalization condition, Uniprot AC, Uniprot ID, protein sequence, 
              GO (Biological process, Cellular component and Molecular function) and data source.
            </span>
          </div>  
      </div>
    </div>  
    <div class="files" style="height:40%">
      <h3>dbMisLoc Data Source</h3>
      <div class="download-content" style="height: 90%">
        <div style="margin:20px;">
          <a :href="'/api/proteins/file'" download="">
            <span>
              <img src="../assets/img/download_csv.png" style="height: 20px; width:auto; vertical-align: middle; margin-right: 10px;" alt="">
            </span>
            <span style="margin-bottom:10px;">
              <b >  All data in the dbMisLoc database(CSV) </b>
            </span>
          </a>
          
        </div>
      </div>
    </div> 
    <div class="files" style="height:40%">
      <h3>dbMisLoc Source Codes</h3>
      <div class="download-content" style="height: 90%">
          <div style="margin:20px;">
            <a href="https://github.com/quinlanW/dbMisLoc" target="_blank">
              <span>
                <img src="../assets/img/download_github.png" style="height: 20px; width:auto; vertical-align: middle; margin-right: 10px;" alt="">
              </span>
              <span style="margin-bottom:10px;">
                <b >  https://github.com/quinlanW/dbMisLoc  </b>
              </span>
            </a>
            
          </div>
      </div>
    </div>  
  </div>
</template>

<script>
// import { getProteinFile } from "@/api/dataReq.js" //test
// import download from '../assets/js/download'
export default {
    methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //test
    // download(){
    //   console.log("start download");
    //   getProteinFile();
    // },
  }
}
</script>

<style scoped>
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

.download-content {
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 20px;
  border: 2px solid #398AB9;
  border-radius: 10px;
}
/* 
a {
  color: #232324;
} */

h3 {
  text-align: left;
  padding: 10px;
  background-color: #398AB9;
  color: #e6f0ef;
  border-radius: 10px;
}

.files {
  width: 70%;
  margin: 0 auto;
}

p {
  text-align: justify;
  line-height: 1.5em;
}

.icon {
  height: 1.5em;
  width: auto;
  vertical-align: middle;
  margin-right: 5px;
}
</style>
