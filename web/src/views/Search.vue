<template>
    <div class="result">
        <div class="header">
        <!--element-ui's composite input box can be slotted to specify the content to be preceded or followed by the input -->
        <el-row class="title" style="color: #606060; text-align: center; font-size: 1.5em; line-height: 80px; height: 80px;">
          <img src="../assets/img/search_label.png" style="height: 45px; width: auto;  vertical-align: middle; margin-right: 10px; margin-bottom: 5px;"/>
            Search from Database
        </el-row>
        <!-- Matching input suggestions after input will result in an untimely rendering error, change to matching input suggestions before input -->
      
        <el-autocomplete
            placeholder="Enter the query"
            v-model="inputContent"
            clearable
            @keyup.enter.native="Search"
            class="input-with-select"
            :fetch-suggestions="querySearch"
        >
            <el-select
            v-model="searchOpt"
            slot="prepend"
            clearable
            placeholder="Search Options"
            class="select"
            >
                <el-option-group
                    v-for="group in options"
                    :key="group.label"
                    :label="group.label"
                >
                    <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-option-group>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="Search"></el-button>
        </el-autocomplete>
        </div>

        <!-- <div>
          <p>{{ propertyresults }}</p>
        </div> -->

        <div class="content" style="height: 70vh; overflow-x: hidden">
          <el-row v-if="id==0" type="flex" justify="space-between" style="padding: 5px;" class="content">
            <el-col :span="12">
              <img src="../assets/img/search_ndata.png" alt="" style="height: auto; width:100%;">
            </el-col>
            <el-col :span="12" class="explain">
              <p>
                You can obtain the desired information by selecting the search type and searching 
                for the corresponding name. If you forget how to spell it, a fuzzy search can be 
                performed by “_" or "%". For example, you want the "PEX19", which can be obtained 
                by searching “PE_19".More detailed fuzzy query rules are given in 'Search help' in 
                the tutorial section of the 'Help' page.

              </p>
              <!-- <img src="" alt=""> -->
              <img
                alt="search example"
                style="height: auto; width: 100%;"
                src="../assets/img/search_example.png"
              />
            </el-col>
          </el-row>
          <!-- Display Form  -->
          <div class="tabletitle" v-if="id==1">
            <el-row>
              <el-col :span="4" :offset="10">
                Search results
              </el-col>
            </el-row>
          </div>
          <el-table
            v-if="id==1"
            id="myTable1"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="proteinSchTable"
            :row-class-name="tabRowClassName"
            empty-text="No data available"
            border
            style="width: 100%"
            ref="table"
          >
            <el-table-column prop="Protein" label="Protein"></el-table-column>
            <el-table-column prop="Normal_localization" label="Normal localization"></el-table-column>
            <el-table-column prop="Mislocalization" label="Mislocalization" ></el-table-column>
            <el-table-column prop="Data_sources" label="PubMed ID">
              <template slot-scope="value">
                <a  v-for="(goid,index) in value.row.Data_sources.replace(/\s*/g,'').split(',')" :key="index" :href="'https://pubmed.ncbi.nlm.nih.gov/'+goid.slice(5,13)"
                    target="_blank" class="TestCSS">{{ goid }}
                  <br></a>
              </template>
            </el-table-column>
            <el-table-column prop="Uniprot_Entry" label="Uniprot ID" >
              <template slot-scope="value">
                <a :href="'https://www.uniprot.org/uniprot/'+value.row.Uniprot_Entry" target="_blank" class="TestCSS">
                  {{value.row.Uniprot_Entry}}
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="Uniprot_Accession_number" label="Uniprot AC" ></el-table-column>

            <el-table-column prop="" label="Details" type="expand" width="100">
              <template slot-scope="props">
                <el-form label-position="left" class="demo-table-expand" label-width="auto" style="font-family: monospace;">
                  <!-- <el-form-item label="Uniprot AC">
                    <span>{{ props.row.Uniprot_Accession_number }}</span>
                  </el-form-item> -->
                  <el-form-item label="Normal localization GO">
                    <a  v-for="(goid,index) in props.row.Normal_localization_GO_ID.split(',')" :key="index" :href="'https://www.ebi.ac.uk/QuickGO/term/'+goid.split('[')[1].split(']')[0]"
                        target="_blank" class="TestCSS">{{ goid }}
                    <br></a>
                    <!-- <span>{{ props.row.Normal_localization_GO_ID }}</span> -->
                  </el-form-item>
                  <el-form-item label="Mislocalization GO">
                    <a  v-for="(goid,index) in props.row.Mislocalization_GO_ID.split(',')" :key="index" :href="'https://www.ebi.ac.uk/QuickGO/term/'+goid.split('[')[1].split(']')[0]"
                        target="_blank" class="TestCSS">{{ goid }}
                    <br></a>
                    <!-- <span>{{ props.row.Mislocalization_GO_ID }}</span> -->
                  </el-form-item>
                  <el-form-item label="Protein sequence">
                    <span>{{ props.row.Nucleotide_Sequences_FASTA }}</span>
                  </el-form-item>
                  <el-form-item label="Mislocalization condition">
                    <span>{{ props.row.Mislocalization_conditions }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
          <template>
            <el-backtop target=".content" :visibility-height="100" :bottom="40">
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
    </div>
</template>

<script>
import { getProteinData } from "@/api/dataReq.js"
import { showLoading, hideLoading } from '../assets/js/loading.js'

export default {
    data() {
		return{
			proteinSchTable: [], // Search display data
			proteinMorTable: [],
			recData: [], // Accepted data
			inputContent: "", // Enter query data
			searchOpt: "Protein", // Select query type
			options: [
				{
					label: "Protein Related",
					options: [
						{ value: "Protein", label: "Protein Name"},
						// { value: "Mislocalization_condition", label: "Mis-condition"}
					]
				},
				{
					label: "Uniprot Related",
					options: [
						{ value: "Uniprot_Accession_number", label: "Uniprot AC"},
						{ value: "Uniprot_Entry", label: "Uniprot ID"}
					]
				},
        {
          label: "Localization Related",
          options: [
            { value: "Normal_localization", label: "Normal Localization"},
            { value: "Mislocalization", label: "Mis-Localization"},
          ]
        },
        {
          label: "Condition Related",
          options: [
            { value: "Mislocalization_conditions", label: "Mis-Condition"}
          ]
        }
			],
			id: 0,  // Query mark
			activeNames: [],
			// Input suggestions for fuzzy matching
			properties: [],
			propertyresults: [],
			proproperty: [],
			misconproperty: [],
			uacproperty: [],
			uidproperty: [],
      norlocproperty: [],
      mislocproperty: [],
		}
    },
    methods: {
        // tabRowClassName({ row, rowIndex }) {
        tabRowClassName({ rowIndex }) {
          // console.log(row);
          var index = rowIndex + 1;
          if (index % 2 == 0) {
            return "warning-row";
          }
        },
        querySearch(queryString, cb) {
          var properties = this.propertyresults;
          var results = queryString
            ? properties.filter(this.createFilter(queryString))
            : properties;
          cb(results);
        },
        // !==-1 indicates that you can match included, not initials
        createFilter(queryString) {
          return property => {
            return (
              property.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
            );
          };
        },
        Search() {
            var searchOpt = this.searchOpt;
            // var _this = this;
            let param ={
              "perPage":200,
              "page":1,
              "conditions": [{
                "prop": searchOpt,
                "op": "like",
                "val": '%'+this.inputContent+'%',
              }]
            };
            showLoading();
            getProteinData(param).then(
              res=>{
                this.proteinSchTable = res.message.info;
                hideLoading();
              },
              err=>{
                console.log(err)
              }
            )
            this.id = 1;
        },
    },

    // filterProperty(){
        //   for(let i=0;i<this.uacproperty.length;i++){
        //     if(this.uacproperty[i]["value"]=='n.a.'){
        //       console.log(this.uacproperty[i]);
        //       delete this.uacproperty[i];
        //     }
        //   }
        // },
    mounted() {
      // var _this = this;
      let params = {
        perPage: 200,
        page: 1,
        conditions: [{
          prop: "num_id",
          op: ">",
          val: 1
        }]
      };
      getProteinData(params).then(
        res=>{
          this.recData = res.message.info;
          let norlocflag = [];
          let mislocflag = [];
          let condflag = [];
          for(var i=0;i<this.recData.length;i++){
            this.properties.push({
              "value": this.recData[i][this.searchOpt]
            });
            this.proproperty.push({
              "value": this.recData[i]["Protein"]
            });
            // Condition
            let condStr = this.recData[i]["Mislocalization_conditions"].split('[')[0].split(',');
            for(let i=0;i<condStr.length;i++){
              if(!condflag.includes(condStr[i])&&condStr[i]!='n.a.'){
                condflag.push(condStr[i]);
                this.misconproperty.push({
                  "value": condStr[i]
                });

              }
            }
            // Uniprot
            if(this.recData[i]["Uniprot_Accession_number"] != 'n.a.'){
              this.uacproperty.push({
                "value": this.recData[i]["Uniprot_Accession_number"]
              });
            }
            if(this.recData[i]["Uniprot_Entry"] != 'n.a.'){
              this.uidproperty.push({
                "value": this.recData[i]["Uniprot_Entry"]
              });
            }
            // localization
            let norlocStr = this.recData[i]["Normal_localization"].split(',');
            for(let i=0;i<norlocStr.length;i++){
              let norloc = norlocStr[i].split('[')[0];
              if(!norlocflag.includes(norloc)&&norloc!='n.a.'){
                norlocflag.push(norloc);
                this.norlocproperty.push({
                  "value": norloc
                });
              }
            }

            let mislocStr = this.recData[i]["Mislocalization"].split(',');
            for(let i=0;i<mislocStr.length;i++){
              let misloc = mislocStr[i].split('[')[0];
              if(!mislocflag.includes(misloc)&&misloc!='n.a.'){
                mislocflag.push(misloc);
                this.mislocproperty.push({
                  "value": misloc
                });
              }
            }
          }
          this.propertyresults = this.properties;
        },
        err=>{
          console.log(err);
        }
      );
    },
    watch:{
      searchOpt(val){
        var searchOpt = val;
        var _this = this;
        if (searchOpt == "") {
          _this.propertyresults = _this.properties;
        } else if (searchOpt == "Protein") {
          _this.propertyresults = _this.proproperty;
        } else if (searchOpt == "Mislocalization_conditions") {
          _this.propertyresults = _this.misconproperty;
        } else if(searchOpt == "Uniprot_Accession_number") {
          _this.propertyresults = _this.uacproperty;
        } else if(searchOpt == "Uniprot_Entry") {
          _this.propertyresults = _this.uidproperty;
        } else if(searchOpt == "Normal_localization") {
          _this.propertyresults = _this.norlocproperty;
        } else if(searchOpt == "Mislocalization") {
          _this.propertyresults = _this.mislocproperty;
        } 
      }
    }
};

</script>

<style>
/* No scoped, if you use the zebra line setting is invalid */
.header {
  width: 100%;
  padding-bottom: 60px;
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
}
.input-with-select {
  width: 60%;
  /* font-size: 15px; */
}
.el-collapse-item__header {
  font-size: 16px;
}

.el-select {
  width: 200px;
}

.el-select-group__title {
  text-align: left;
}

.el-select-dropdown__item {
  text-align: left;
  text-indent: 2em;
}

.el-input {
  font-size: 15px;
}

.content {
  padding: 10px;
}

.el-table {
  font-size: 15px;
  color: #232324;
  white-space: pre-line;
}

.el-table .warning-row {
  background: #9AD0EC;
}
.tabletitle {
  text-align: center;
  background-color: #9AD0EC;
  height: 30px;
  line-height: 30px;
  color: #686868;
  font-weight: bold;
}
.explain {
  border: solid 1px #398AB9;
  padding: 10px;
}
.explain p {
  text-indent: 2em;
  text-align: justify;
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
.el-form-item {
  float: left;
  clear: both;
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}

</style>
<style lang="scss" scoped> 
::v-deep .el-form-item__label {
  float: none; 
  word-break: break-word; 
}
::v-deep .el-table__expand-icon{
 -webkit-transform: rotate(0deg);
 transform: rotate(0deg);
}
</style>