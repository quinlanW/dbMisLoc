<template>
  <div>
    <el-row class="title" style="color: #606060;">
      <img src="../assets/img/home_label.png" style="height: 45px; width: auto;  vertical-align: middle; margin-right: 10px; margin-bottom: 5px;" />
      Welcome to <b>dbMisLoc</b>
    </el-row>
    <el-row class="content" type="flex" justify="space-between">
      <el-col :span="10">
        <i style="font-size: 20px; margin-right: 10px; color: #606060;" class="el-icon-info" >
          Introduction of dbMisLoc</i>
        <p>
          <b>dbMisLoc</b> is a <b>d</b>ata<b>b</b>ase of
          conditional protein <b>mis-loc</b>alization events.
          The database deposits the subcellular localization of proteins under different 
          cellular conditions. The normal localizations, mis-localizations and the condition 
          of abnormal localizations are recorded in the database.
        </p>
        <p>
          The<router-link to="/home"><b><i> 'Home'</i></b></router-link>
          page mainly describes the organization of the dbMisLoc server.
        </p>
        <p>
          The<router-link to="/browse"><b><i> 'Browse'</i></b></router-link>
          page clusters all conditional protein mis-localization events according to the 
          normal localizations, mis-localizations and mis-localization conditions. Users 
          can browse all the data hierarchically on this page.
        </p>
        <p>
          The<router-link to="/search"><b><i> 'Search'</i></b></router-link>
          page provides the ability to search by protein name, Uniprot AC and Uniprot ID. 
          If the content of the search box matches the first few letters of the selected 
          attributes, a drop-down menu will be displayed. The corresponding information 
          will be displayed in a table with links to the original literatures for each event.
        </p>
        <p>
          The<router-link to="/visualization"><b><i> 'Visualization'</i></b></router-link>
          page allows the user to display the normal localizations and the mis-localizations 
          of the same protein on a high-resolution cell structure diagram.
        </p>
        <p>
          The<router-link to="/blast"><b><i> 'Blast'</i></b></router-link>
          page incorporates the BLAST program for comparing query sequences against those in 
          the dbMisLoc database.
        </p>
        <p>
          The<router-link to="/download"><b><i> 'Download'</i></b></router-link>
          page lists static links to all the data packages in the dbMisLoc database.
        </p>
        <p>
          The<router-link to="/help"><b><i> 'Help'</i></b></router-link>
          page provides step-by-step instructions on how to use the dbMisLoc database.
        </p>
        <p>
          Currently, <b>110</b> conditional protein mis-localization events are stored 
          in the dbMisLoc database, and new data are constantly added manually.
        </p>
        <p>
          Last update on: Jun. 16th, 2021.
        </p>
      </el-col>
      <el-col :span="13">
        <img
          alt="basic properties"
          src="../assets/img/home_right.png"
          style="max-width: 100%; height: auto; margin: 60px;"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>

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
.content {
  padding: 20px 10%;
  margin: 0 auto;
  text-align: left;
}
.content p {
  /* Row spacing */
  line-height: 1.5em;
  /* First line indent */
  /* text-indent: 2em; */
  /* Alignment of both ends */
  text-align: justify;
}
.content p a {
  color: #202122;
}
</style>
