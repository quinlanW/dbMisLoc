<template>
  <div class="bbody" style="height: 100vh; overflow-x: hidden">
    <el-row class="title" style="color: #606060;">
      <img
        style="margin-right: 20px; height: 45px; width: auto; vertical-align: middle; margin-right: 5px; margin-bottom: 5px;"
        src="../assets/img/browse_label.png"
      />
      Browse all
    </el-row>
    <!-- After adding height, the el-container tab inside has no sliding bar -->
    <el-container style="height: expression(document.body.clientHeight-130px); border: 1px solid #eee" >
      <!-- Side navigation bar -->
      <el-aside width="250px" style="background-color: rgb(238, 241, 246); text-align:left;">
        <el-menu :default-openeds="['1']">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-grid"></i><b>Normal Localization</b>
            </template>
            <div v-for="(value,index) in normallocationgo" :key="index">
                <el-menu-item index="1-1">
                    <span style="display:block;width:90%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;" :title="value">
                        <a href="javascript:void(0)" @click="goAuchor('0',index)">{{value}}</a>
                    </span>
                </el-menu-item>
            </div>

          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-s-grid"></i><b>Mislocalization</b>
            </template>
            <div v-for="(value,index) in mislocationgo" :key="index">
                <el-menu-item index="2-1">
                    <a href="javascript:void(0)" @click="goAuchor('1',index)">{{value}}</a>
                </el-menu-item>
            </div>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-document"></i><b>Mis-Condition</b>
            </template>
            <div v-for="(value,index) in conditiongo" :key="index">
                <el-menu-item index="3-1">
                    <a href="javascript:void(0)" @click="goAuchor('2',index)">{{value}}</a>
                </el-menu-item>
            </div>
          </el-submenu>
        </el-menu>
      </el-aside>
      
      <el-container>
        <el-main class="browseBody">
          <div class="cluster-reference" v-for="(valueclass,keyclass,indexclass) in dataclass" :key="keyclass" :value="valueclass">
                <div v-for="(value,key,index) in valueclass" :key="index">
                    <div :id="indexclass.toString()+index.toString()">
                        <h3><a name="cluster1"></a>Clustering according to {{ keyclass }} : {{ key }}</h3>
                        <!-- height Fixed meter head -->
                        <el-table
                          :data="value"
                          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                          style="width: 100%"
                          empty-text="cannot find"
                          border
                          stripe
                          ref="table"
                          strip highlight-current-row
                        >
                            <el-table-column prop="Protein" label="Protein"></el-table-column>
                            <el-table-column prop="Normal_localization" label="Normal localization" ></el-table-column>
                            <el-table-column prop="Mislocalization" label="Mislocalization" ></el-table-column>
                            <el-table-column prop="Data_sources" label="PubMed ID">
                              <template slot-scope="value">
                                <a  v-for="(goid,index) in value.row.Data_sources.replace(/\s*/g,'').split(',')" :key="index" :href="'https://pubmed.ncbi.nlm.nih.gov/'+goid.slice(5,13)"
                                    target="_blank" class="TestCSS">{{ goid }}
                                  <br></a>
                              </template>
                            </el-table-column>
                            <el-table-column prop="Uniprot_Entry" label="Uniprot ID">
                              <template slot-scope="value">
                                <a :href="'https://www.uniprot.org/uniprot/'+value.row.Uniprot_Entry" target="_blank" class="TestCSS">
                                  {{value.row.Uniprot_Entry}}
                                </a>
                              </template>
                            </el-table-column>
                            <el-table-column prop="Uniprot_Accession_number" label="Uniprot AC" ></el-table-column>

                            <el-table-column prop="" label="Details" type="expand" width="90">
                                <template slot-scope="props">
                                    <el-form label-position="left" class="demo-table-expand" label-width="auto" style="font-family: monospace;">
                                        <el-form-item label="Normal localizaiton GO">
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
          </div>
        </el-main>
      </el-container>
    </el-container>
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
import { getProteinData } from "@/api/dataReq.js"
import { showLoading, hideLoading } from '../assets/js/loading.js'

export default {
    data() {
        return {
            dataclass:{},
            alldata:[],
            proteinData: [],
            normallocationgo:[],
            mislocationgo:[],
            conditiongo:[],
            dialogFormVisible:false,
        };
    },
    mounted() {   
        this.getdata();
    },
    methods: {
        goAuchor(type,index){
            var goid =type+index.toString();
            document.getElementById(goid).scrollIntoView(true)
        },
        datamakeclass(data){
            var nomdicts = {};
            var misdicts = {};
            var conditiondicts={};
            var noms_num = {};
            var miss_num = {};
            var cons_num = {};
            for(let i=0;i<data.length;i++){
                var dict = data[i];
                var nom_all = dict.Normal_localization;
                var mis_all = dict.Mislocalization;
                var condition = dict.Mislocalization_conditions;
                
                nom_all = nom_all.replace(/"/g,"");
                mis_all = mis_all.replace(/"/g,"");
                condition = condition.replace(/"/g,"");
                
                nom_all = nom_all.replace(/[([]{1}.+.[)]]{1}/g,"")
                mis_all = mis_all.replace(/[([]{1}.+.[)]]{1}/g,"")
                condition = condition.replace(/[([]{1}.+.[)]]{1}/g,"")

                var noms = nom_all.split(",");
                for(let i=0;i<noms.length;i++){
                  noms[i] = noms[i].split('[')[0].split('(')[0];
                }
                var miss = mis_all.split(",");
                for(let i=0;i<miss.length;i++){
                  miss[i] = miss[i].split('[')[0].split('(')[0];
                }
                var cons = condition.split("[")[0].split(",");

                for(let j = 0;j<noms.length;j++) {
                    var nom = noms[j]
                    if (nomdicts[nom] == undefined) {
                        if(nom!=""){
                            nomdicts[nom] = [dict];
                            noms_num[nom] = 1;
                            this.normallocationgo.push(nom);
                        }
                    }
                    else{
                        noms_num[nom] += 1;
                        nomdicts[nom].push(dict)
                    }
                }

                for(let j = 0;j<miss.length;j++) {
                    var mis = miss[j]
                    if (misdicts[mis] == undefined)
                        if(mis!=""){
                        misdicts[mis] = [dict]
                        miss_num[mis] = 1;
                        this.mislocationgo.push(mis)
                        }else{
                          console.log("");
                        }
                    else {
                        miss_num[mis] = miss_num[mis] +1;
                        misdicts[mis].push(dict);
                    }
                }

                for(let j = 0;j<cons.length;j++){
                    var con = cons[j]
                    if (conditiondicts[con] == undefined)
                        if(con!=""){
                        conditiondicts[con] = [dict];
                        cons_num[con]=1;
                        this.conditiongo.push(con)
                        }
                        else{
                        if (conditiondicts["no condition"] == undefined) {
                            cons_num["no condition"] = 1;
                            conditiondicts["no condition"] = [dict];
                        }
                        else {
                            cons_num["no condition"] = cons_num["no condition"]+1;
                        }
                        }
                    else {
                        cons_num[con] = cons_num[con]+1;
                        conditiondicts[con].push(dict)
                    }
                }
            }
            var dataclass = {}
            var numbers =[noms_num,miss_num,cons_num]
            localStorage.setItem('numbers',numbers)

            this.normallocationgo.sort();
            this.mislocationgo.sort();
            this.conditiongo.sort();
            var nomkeys = Object.keys(nomdicts).sort();
            var miskeys = Object.keys(misdicts).sort();
            var conkeys = Object.keys(conditiondicts).sort();
            var nomdict_sorted = {};
            var misdict_sorted = {};
            var condict_sorted = {};
            for(let i=0; i<nomkeys.length; i++){
              let key = nomkeys[i];
              let value = nomdicts[key];
              nomdict_sorted[key] = value;
            } 
            for(let i=0; i<miskeys.length; i++){
              let key = miskeys[i];
              let value = misdicts[key];
              misdict_sorted[key] = value;
            } 
            for(let i=0; i<conkeys.length; i++){
              let key = conkeys[i];
              let value = conditiondicts[key];
              condict_sorted[key] = value;
            }        

            dataclass["normal localization"] = nomdict_sorted;
            dataclass["mislocalization"] = misdict_sorted;
            dataclass["mislocalization condition"] = condict_sorted;

            delete dataclass["normal localization"]['n.a.'];
            delete dataclass["mislocalization"]['n.a.'];
            delete dataclass["mislocalization condition"]['n.a.'];

            var norindex = this.normallocationgo.indexOf('n.a.');
            var misindex = this.mislocationgo.indexOf('n.a.');
            var conindex = this.conditiongo.indexOf('n.a.');
            this.normallocationgo.splice(norindex, 1);
            this.mislocationgo.splice(misindex, 1);
            this.conditiongo.splice(conindex, 1);

            this.dataclass=dataclass;
            return dataclass;
        },
        getdata(){
            let param ={
                perPage: 200,
                page:1,
                conditions: [{
                    prop: "num_id",
                    op: ">",
                    val: 0,
                    }
                ]
            };
            showLoading();
            getProteinData(param).then(
                res=>{
                    // this.loading = false;
                    this.alldata=res.message.info;
                    console.log(this.alldata['Nucleotide_Sequences_FASTA']);
                    //Data Classification
                    this.datamakeclass(this.alldata);
                    hideLoading();
                    // console.log(this.dataclass);
                    // this.closeLoading;
                },
                err=>{
                    console.log(err)
                }
            )
        },
    }
};
</script>

<style>
.el-table__expand-icon:after{
  content: "More";
  color: #1526df;
  /* cusor: pointer; */
}
.el-table__expand-icon >i{
  display: none !important;
}
</style>
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
.el-table {
  font-size: 15px;
  color: #232324;
  white-space: pre-line;
}
.el-aside {
  color: #333;
}
.el-menu-item {
    font-size: 15px;
}

h3 {
  text-align: left;
  /* border-bottom: 2px solid; */
  /* border-bottom-color: rgb(115, 200, 200); */
  padding: 10px;
  background-color: #398AB9;
  color: #EFFFFD;
  border-radius: 10px;
}
a {
  color: #202122;
}
a:hover {
  color: #5D8BF4;
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
