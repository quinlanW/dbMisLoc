<template>
    <div class="result">
        <div class="header">
        <el-row class="title" style="color: #606060; text-align: center; font-size: 1.5em; line-height: 80px; height: 80px;">
          <img src="../assets/img/search_label.png" style="height: 45px; width: auto;  vertical-align: middle; margin-right: 20px;"/>
            Search from Database
        </el-row>
      
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
        <div class="content">
          <!-- 未进行查询 没有数据显示 -->
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
          <!-- 展示表格  -->
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
                  <el-form-item label="Normal localization GO">
                    <span>{{ props.row.Normal_localization_GO_ID }}</span>
                  </el-form-item>
                  <el-form-item label="Mislocalization GO">
                    <span>{{ props.row.Mislocalization_GO_ID }}</span>
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
          
        </div>
    </div>
</template>

<script>
import { getProteinData } from "@/api/dataReq.js"

export default {
    data() {
      return{
          proteinSchTable: [], // 搜索展示数据
          proteinMorTable: [],
          recData: [], // 接受数据
          inputContent: "", // 输入查询数据
          searchOpt: "Protein", // 选择查询类型
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
              }
          ],
          id: 0,  // 查询标记
          activeNames: [],
          // 用于模糊匹配的输入建议
          properties: [],
          propertyresults: [],
          proproperty: [],
          misconproperty: [],
          uacproperty: [],
          uidproperty: [],
          
      }
    },
    methods: {
        
        tabRowClassName({ row, rowIndex }) {
          console.log(row);
          var index = rowIndex + 1;
          if (index % 2 == 0) {
            return "warning-row";
          }
          // console.log(rowIndex);
        },
        querySearch(queryString, cb) {
          var properties = this.propertyresults;
          // console.log("q", properties);
          var results = queryString
            ? properties.filter(this.createFilter(queryString))
            : properties;
          cb(results);
        },
        // !==-1 表示可以匹配包含的，而不是首字母
        createFilter(queryString) {
          return property => {
            return (
              // 这里必须是property.value 才有效?
              property.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
            );
          };
        },
        Search() {
            console.log("click search");
            var searchOpt = this.searchOpt;
            let param ={
              "perPage":200,
              "page":1,
              "conditions": [{
                "prop": searchOpt,
                "op": "like",
                "val": '%'+this.inputContent+'%',
              }]
            };
            getProteinData(param).then(
              res=>{
                this.proteinSchTable = res.message.info;
                console.log(this.proteinSchTable)
              },
              err=>{
                console.log(err)
              }
            )
            this.id = 1;
        },
    },
    mounted() {
      var _this = this;
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
          for(var i=0;i<this.recData.length;i++){
            _this.properties.push({
              "value": this.recData[i][this.searchOpt]
            });
            _this.proproperty.push({
              "value": this.recData[i]["Protein"]
            });
            _this.misconproperty.push({
              "value": this.recData[i]["Mislocalization_condition"]
            });
            _this.uacproperty.push({
              "value": this.recData[i]["Uniprot_Accession_number"]
            });
            _this.uidproperty.push({
              "value": this.recData[i]["Uniprot_Entry"]
            });
          }
          _this.propertyresults = _this.properties;
        },
        err=>{
          console.log(err);
        }
      )
    },
    watch:{
      searchOpt(val){
        var searchOpt = val;
        var _this = this;
        if (searchOpt == "") {
          _this.propertyresults = _this.properties;
        } else if (searchOpt == "Protein") {
          _this.propertyresults = _this.proproperty;
        } else if (searchOpt == "Mislocalization_condition") {
          _this.propertyresults = _this.misconproperty;
        } else if(searchOpt == "Uniprot_Accession_number") {
          _this.propertyresults = _this.uacproperty;
        } else if(searchOpt == "Uniprot_Entry") {
          _this.propertyresults = _this.uidproperty;
        }
      }
    }
};

</script>

<style>
/* 没有用scoped 如果使用斑马线设置无效 */
.header {
  width: 100%;
  padding-bottom: 60px;
  background: #e6f0ef; /* Old browsers */
  background: -moz-linear-gradient(
    -45deg,
    #e6f0ef 45%,
    #b4ede7 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    -45deg,
    #e6f0ef 45%,
    #b4ede7 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    135deg,
    #e6f0ef 45%,
    #b4ede7 100%
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
  background: #ccf1f1;
}
.tabletitle {
  text-align: center;
  background-color: #99cccc;
  height: 30px;
  line-height: 30px;
  color: #686868;
  font-weight: bold;
}
.explain {
  border: solid 1px #99cccc;
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
// /deep/会报错 用::v-deep
::v-deep .el-form-item__label {
  float: none; // 取消label左浮动
  word-break: break-word; // 支持单词截断换行
}
::v-deep .el-table__expand-icon{
 -webkit-transform: rotate(0deg);
 transform: rotate(0deg);
}
</style>