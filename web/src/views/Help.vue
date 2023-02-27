<template>
  <div class="bbody" style="height: 90vh; overflow-x: hidden">
    <el-row class="title" style="color: #606060;">
      <img
        src="../assets/img/help_label.png"
        style="height: 45px; width: auto;  vertical-align: middle; margin-right: 10px; margin-bottom: 5px;"
      />
      Help
    </el-row>
    <div class="perspective">
      <h3>Tutorial</h3>
      <el-collapse v-model="activeName" accordion class="content">
        <el-collapse-item title="1. Overview" name="1">
          <p>
            Mislocalization information of proteins is important for understanding 
            diseases and developing corresponding therapies, and also plays an important 
            role in bioinformatics species. Here, we have developed a database called dbMisLoc (<b>
              <a href="https://dbml.pufengdu.org">https://dbml.pufengdu.org</a>
            </b>), which manually collects and collates information on the normal localization 
            , mislocalization, sequences, and the corresponding gene ontology 
            descriptions of proteins from existing databases and published literature. Currently, the dbMisLoc 
            database contains <b>146</b> proteins with mislocalizations, and the data will be 
            continuously added and updated.
          </p>
        </el-collapse-item>
        
        <el-collapse-item title="2. Browse help" name="2">
          <p>
            <strong>(1).</strong> Users can browse information related to the normal localization, 
            mislocalization, and related original references of proteins. The navigation bar on the 
            left categorizes all data according to normal localization, mislocalization, and 
            mislocalization conditions. Users can independently select categories to browse.
          </p>
          <img alt="browse help" src="../assets/img/help/browse.png" />
          <p>
            <strong>(2).</strong> The 'Browse' page also provides external links to related 
            websites (PubMed, Uniprot and QuickGO) to view related information.
          </p>
          <img src="../assets/img/help/browse_2.png" alt="browse help">
        </el-collapse-item>
        <el-collapse-item
          title="3. Search help"
          name="3"
        >
          <p>
            <strong>(1).</strong> The picture below is an introduction to the
            'Search' page. A dropdown menu will be displayed if the content of
            the search box matches the first few letters of the protein name, 
            Uniprot ID, Uniprot AC, subcellular localization or mis-localization 
            condition.
          </p>
          <img alt="search help" src="../assets/img/help/search_1.png" />
          <p>
            <strong>(2).</strong> Click on the 'More' button to expand the folding 
            panel to view more protein-related information (protein sequence information, gene ontology, etc.)
          </p>
          <img alt="search help" src="../assets/img/help/search_2.png" />
          <p>
            <strong>(3).</strong> The query box supports wildcard queries using '_' and '%'. Where '_' can match 
            any single character, and '%' matches any number of characters.
          </p>
          <img alt="search help" src="../assets/img/help/search_3.png" />
          <img alt="search help" src="../assets/img/help/search_4.png" />
          <p>
            <strong>(4).</strong> You can also enter the part of the value you want to query to make a fuzzy query. 
            For example, if you want to find all the proteins that contain the field "B7", you can search for "B7" directly.
          </p>
          <img alt="search help" src="../assets/img/help/search_5.png" />
        </el-collapse-item>
        <el-collapse-item title="4. Visualization help" name="4">
          <p>
            In the 'Visualisation' page, the user can enter the protein name and mark the normal 
            localization and mislocalization of the protein in the cell structure diagram and 
            display the localization information below.
          </p>
          <p>
            <strong>(1).</strong> As with the search page, the visualisation page also 
            offers dropdown menu prompts based on user input.
          </p>
          <img alt="visualization help" src="../assets/img/help/visualization_1.png" />

          <p>
            <strong>(2).</strong> After clicking on the 'Visualize' button, the normal 
            localization and  mislocalization of the protein will be marked in the cell 
            structure diagram with the corresponding table display.
          </p>
          <img alt="visualization help" src="../assets/img/help/visualization_2.png" />
          
        </el-collapse-item>
        <el-collapse-item title="5. Blast help" name="5">
          <p>
            In the 'Blast' page, the user can enter the protein sequence in FASTA format for 
            comparison with sequences stored in the database, and the results of the sequence 
            comparison will be displayed below.
          </p>
          <p>
            <strong>(1).</strong> Enter protein sequence or click 'Example' to use template protein sequence.
          </p>
          <img alt="blast" src="../assets/img/help/blast_1.png" />
          <p>
            <strong>(2).</strong> Set e-value and wordsize, then click 'Blast' button to compare, 
            the result will be shown in the following table.
          </p>
          <img alt="blast" src="../assets/img/help/blast_2.png" />
          <p>
            <strong>(3).</strong> Click the 'More' button to view details of the corresponding protein.
          </p>
          <img alt="blast" src="../assets/img/help/blast_3.png" />
        </el-collapse-item>
        <el-collapse-item title="6. Download help" name="6">
          <p>
            <strong>(1).</strong> Users can download all data (CSV format) and source code of dbMisLoc database.
          </p>
          <img alt="download help" src="../assets/img/help/download.png" />
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="perspective">
      <h3>Contact</h3>
      <div class="setborder">
        <p>
          For any suggestions, technical issues, data depositions and error
          reports, please contact Dr. Pu-Feng Du by email (<a
            href="mailto:pdu@tju.edu.cn"
            >pdu@tju.edu.cn</a
          >).
        </p>
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
export default {
  data() {
    return {
      // The href corresponds to the link name in the second part of the Browse page
      statistics: [
        {
          filesrc: "statistics_01.jpg",
          href: "/browse#mononucleotide"
        },
        {
          filesrc: "statistics_02.jpg",
          href: "/browse#dinucleotidedna"
        },
        {
          filesrc: "statistics_03.jpg",
          href: "/browse#dinucleotiderna"
        },
        {
          filesrc: "statistics_04.jpg",
          href: "/browse#trinucleotide"
        }
      ],
      activeName: ["1"]
    };
  }
};
</script>

<style lang="less" scoped>
.title {
  text-align: center;
  font-size: 1.5em;
  line-height: 80px;
  height: 80px;
  background: #e6f0ef; /* Old browsers */
  background: -moz-linear-gradient(
    -45deg,
    #DFF6FF 45%,
    #00B4D8 100%
  ); /* FF3.6-15 */
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
  // width: 90%;
  margin: 10px auto;
  padding: 20px;
  border: 2px solid #398AB9;
  border-radius: 10px;
  // background-color: #b4ede7;
}

.content img {
  width: 90%;
  height: auto;
}

/deep/ .el-collapse-item__header {
  font-size: 16px;
  padding-left: 20px;
}

/deep/ .el-collapse-item__content {
  border-top: 1px solid #398AB9;
}

p {
  font-size: 16px;
  line-height: 1.5em;
  text-align: justify;
  padding: 0 30px;
}

.perspective {
  width: 90%;
  margin: 0 auto;
}

.setborder {
  border: 2px solid #398AB9;
  border-radius: 10px;
}

h3 {
  text-align: left;
  padding: 10px;
  background-color: #398AB9;
  color: #e6f0ef;
  border-radius: 10px;
}
</style>
