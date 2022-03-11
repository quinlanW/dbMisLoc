<template>
  <div>
    <el-row class="title" style="color: #606060;">
      <img style="margin-right: 10px; height: 50px; width: auto; vertical-align: middle;" src="../assets/img/vis_label.png"/>
      Visualization
    </el-row>
    <div class="myForm">
        <!-- Form  -->
        <el-autocomplete 
            v-model="pname" 
            :fetch-suggestions="querySearchAsync" 
            placeholder="Please enter protein" 
            @select="handleSelect"
            class="input-with-select"
            clearable
            style="padding: 10px"
        >
        </el-autocomplete>
        <el-button class="sou" type="primary" @click="visualization" icon="el-icon-search" plain>Visualize</el-button>
  
        <div v-show="isshowresult">
          <el-divider></el-divider>
          <el-table :data="tableData" empty-text="No localization information" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            
            <el-table-column label="Normal localization" prop="norloc"></el-table-column>
            <el-table-column label="Mislocalization" prop="misloc"></el-table-column>
            <el-table-column label="Details" type="expand" width="120" >
              <template slot-scope="props">
              <el-form label-position="left" class="demo-table-expand" label-width="auto">
                <el-form-item label="Mislocalization Condition">
                    <span>{{ props.row.condition }}</span>
                </el-form-item>
                <!-- <el-form-item label="Mislocalization Interpretation">
                    <span>{{ props.row.condition }}</span>
                </el-form-item> -->
              </el-form>
              </template>
            </el-table-column>
            <!-- <el-table-column label="Mislocalization interpretation" prop="condition"></el-table-column> -->
          </el-table>
        </div>
        <el-divider></el-divider>
        <div class="show_result" v-show="true" id="show_result">
            <div class="showbox" id="mouse"></div>
            <div class="svgbox" id="svgbox" style="width:80%"></div>
        </div>
    </div>
  </div>
</template>

<script>
// Cell_membrane, cytoplasm, nucleus, endoplasmic_reticulum, mitochondria, Golgi_apparatus, ribosome, lysosome and centrosome
import $ from 'jquery'
import { getProteinData } from '@/api/dataReq'
import { SVG,SCRIPT_NOMLOCATION,LOCATION_SVG_D } from '../assets/js/visulization.js'

export default {
    name: "Visualization",
    data() {
        return {
            isshowresult:false,
            Mislocalization:'',
            Normal_localization:'',
            Interpretation:'',
            pname:'',
            pnames:[],
            data:[],
            tableData: [],
            Positioning_coordinates:{
                "Nucleolus":[99.31,71],
                "Cytoplasm": [55.17,96.88],
                "Cytosol":[62,92],
                "Mitochondrion": [60, 106],
                "Nucleus": [118, 69],
                "Plasma Membrane":[142,70],
                "Menbrane": [142, 70],
                // "Cell Surface":[148,26],
                "Cell Surface":[150, 85],
                "Endoplasmic Reticulum": [118, 91],
                "Golgi Apparatus": [120,110],
                "Trans-Golgi Network": [120,110],
                "Peroxisome": [102,146],
            },
        };
    },
    mounted(){
        var showDiv = document.getElementById('svgbox');
        showDiv.innerHTML=SVG;
        $('#show_result').html($('#show_result').html())
    },
    methods: {
        querySearchAsync(queryString, cb) {
            let param ={
                perPage:200,
                page:1,
                conditions: [{
                    prop: "Protein",
                    op: "like",
                    val: '%'+this.pname+'%',
                }]
            };
            getProteinData(param).then(
                res=>{
                    var pnames = res.message.info;
                    pnames = pnames.map(o=>{return{value:o.Protein}});
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        cb(pnames);
                    }, 
                    300 * Math.random());
                },
                err=>{
                    console.log(err)
                }
            )
        },
        // handleSelect(item) {
        handleSelect() {
            console.log("");
        },
        visualization(){
            this.tableData = [];
            this.getproteins();
        },
        getproteins(){
            this.isshowresult = false; // new
            deleteoldsvg();

            if(this.pname != ''){
                let param ={
                    perPage:1,
                    page:1,
                    conditions: [{
                        prop: "Protein",
                        op: "=",
                        val: this.pname,
                    }]
                };
                getProteinData(param).then(
                    res=>{
                        this.data = res.message.info;
                        console.log(this.data);
                        if(this.data.length==0||(this.data.length==1&&this.data[0].num_id=='')){
                            window.alert("No data available.")
                            $('#show_result').html($('#show_result').html())
                        }else{
                            
                            this.isshowresult = true;
                            this.Mislocalization = this.data[0].Mislocalization.replace(/\[.*?\]/g,'').replace(/\(.*?\)/g,'');
                            this.Normal_localization = this.data[0].Normal_localization.replace(/\[.*?\]/g,'').replace(/\(.*?\)/g,'');
                            this.Interpretation = this.data[0].Mislocalization_conditions;
                            
                            this.tableData.push({
                              'norloc': this.data[0].Normal_localization,
                              'misloc': this.data[0].Mislocalization,
                              'condition': this.Interpretation
                              
                            });
                            
                            this.showresult();
                        }
                    },
                    err=>{
                        console.log(err)
                    }
                )
            }else {
                window.alert("Please enter a protein.");
            }
        },
        // Add normal positioning
        addnormal(normal_localization){
            var normal="";
            normal = normal_localization;
            var first = this.Positioning_coordinates[normal];
            if(first!=null){
                var svg = document.getElementById('svg_01');
                svg.appendChild(createlocation(first[0],first[1],true));
            }else {
                console.log("");
            }
        },
        // Add Exception Location
        addinnormal(mislocalization){
            var innormal="";
            innormal = mislocalization;
            var final = this.Positioning_coordinates[innormal]
            if(final!=null){
                var svg = document.getElementById('svg_01');
                svg.appendChild(createlocation(final[0],final[1],false));
            }else {
                console.log("");
            }
        },
        // Display visualization results
        showresult() {
            var abnormal_list = this.data[0].Mislocalization.replace(/"/g,"").replace(/\[.*?\]/g,'').replace(/\(.*?\)/g,'').split(",");
            var normal_list = this.data[0].Normal_localization.replace(/"/g,"").replace(/\[.*?\]/g,'').replace(/\(.*?\)/g,'').split(",");
            
            for(var i = 0; i<abnormal_list.length;i++){
                for(var j = 0; j< normal_list.length;j++){
                    var innormal = abnormal_list[i]; // Anomaly Location
                    var normal = normal_list[j]; // Normal positioning
                    var first = this.Positioning_coordinates[normal];  // Starting point Normal positioning
                    var final = this.Positioning_coordinates[innormal];  // End point Abnormal positioning
                    
                    if(first == undefined && final == undefined){
                      console.log("");
                    }
                    else if(first == undefined && final != undefined){
                      this.addinnormal(abnormal_list[i]);
                    }
                    else if(first != undefined && final == undefined){
                      this.addnormal(normal_list[j]);
                    }
                    else{
                      if(first==final){
                        this.isshowresult = true;
                      }
                      else{
                          this.isshowresult = true;
                          var svg = document.getElementById('svg_01');
                          var arrow = createarrow(first[0],first[1], final[0],final[1]); // Create Arrows
                          var path = createSVGPath(first[0],first[1], final[0],final[1]); // Creating Arcs   
                          svg.appendChild(arrow);
                          svg.appendChild(path);
                      }
                      this.addinnormal(abnormal_list[i]); // Marke anomaly location
                      this.addnormal(normal_list[j]); // Mark normal positioning
                    } 
                }
            }
            
            $('#svgbox').html($('#svgbox').html())
        }
    }
};

// Create Arc
function createSVGPath(startX, startY,finalX,finalY) {
    
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var cxx = (startX + finalX)/2;
    var cyy = (startY + finalY)/2;
    var k = -(startX - finalX)/(startY-finalY);
    var b = cyy - cxx*k;
    
    cxx = cxx+0.6*(startX - finalX)*Math.sqrt(1/(k*k+1));
    cyy = k*cxx + b;
    var dArr = ["M" + startX, startY , "Q" + cxx, cyy, finalX,finalY];
    var d = dArr.join(" ");
    path.setAttribute('d', d);
    path.setAttribute('stroke', "black");
    path.setAttribute('stroke-width', 1);
    path.setAttribute('fill', 'none');
    path.setAttribute('transform',"translate(-5.2 -49.72)")
    path.setAttribute("class","newadd")

    return path;
}

// Create Arrows
function createarrow(startX, startY,finalX,finalY){
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var cxx = (startX + finalX)/2;
    var cyy = (startY + finalY)/2;
    var k = -(startX - finalX)/(startY-finalY);
    var b = cyy - cxx*k;
    cxx = cxx+0.6*(startX - finalX)*Math.sqrt(1/(k*k+1));
    cyy = k*cxx + b;

    var k1 = (cyy - finalY)/(cxx - finalX)
    var k2 = -(1/k1)
    var b1 = cyy - k1*cxx;

    var midxx = finalX + 6*((cxx - finalX)/Math.abs(cxx - finalX))*Math.sqrt(1/(k1*k1+1));
    var midx = finalX + 12*((cxx - finalX)/Math.abs(cxx - finalX))*Math.sqrt(1/(k1*k1+1));
    var midyy = k1*midxx + b1;
    var midy = k1*midx + b1;

    var b2 = midy - k2*midx;

    var needx1 = midx + 5*Math.sqrt(1/(k2*k2+1));
    var needx2 = midx - 5*Math.sqrt(1/(k2*k2+1));
    var needy1 = k2*needx1 + b2;
    var needy2 = k2*needx2 + b2;
    var dx = finalX - midxx;
    var dy = finalY - midyy;
    midxx = finalX;
    midyy = finalY;
    finalX = midxx + dx;
    finalY = midyy + dy;
    needx1 = needx1 + dx;
    needx2 = needx2 + dx;
    needy1 = needy1 + dy;
    needy2 = needy2 + dy;
    var dArr = ["M" + needx1,needy1 , "L" +  midxx,midyy,needx2,needy2];
    var d = dArr.join(" ");
    path.setAttribute('d', d);
    path.setAttribute("class","newadd")
    path.setAttribute('stroke', "black");
    path.setAttribute('stroke-width', 1);
    path.setAttribute('fill', 'none');
    path.setAttribute('transform',"translate(-5.2 -49.72)")
    return path;
}


// Create location icons
function createlocation(x,y,isnormal){
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    var animate1 = document.createElement("animate")
    var animate2 = document.createElement("animate")
    animate1.setAttribute("id","ani1");
    animate1.setAttribute("attributeName","fill-opacity");
    animate1.setAttribute("attributeType","XML");
    animate1.setAttribute("begin","0s;ani2.end");
    animate1.setAttribute("dur","0.1s");
    animate1.setAttribute("from","1");
    animate1.setAttribute("to","0.4");
    animate1.setAttribute("fill","freeze");
    animate2.setAttribute("id","ani2");
    animate2.setAttribute("attributeName","fill-opacity");
    animate2.setAttribute("attributeType","XML");
    animate2.setAttribute("begin","ani1.end");
    animate2.setAttribute("dur","0.1s");
    animate2.setAttribute("from","0.4");
    animate2.setAttribute("to","1");
    animate2.setAttribute("fill","freeze");
    var translate=[-11,-117];
    var alpha= 0;
    var beta = 0;
    style.setAttribute("type","text/css")
    defs.appendChild(style)
    svg.setAttribute("x",x+translate[0]+alpha);
    svg.setAttribute("y",y+translate[1]+beta);
    svg.setAttribute("t","1618410286943");
    svg.setAttribute("className","nomallocation");
    svg.setAttribute("viewBox","0 0 1024 1024");
    svg.setAttribute("version","1.1");
    svg.setAttribute("xmlns","http://www.w3.org/2000/svg");
    svg.setAttribute("width","10");
    svg.setAttribute("hight","10");
    svg.setAttribute("p-id","3994");
    // Drawing icons
    var d = LOCATION_SVG_D
    path.setAttribute('d',d);
    // path.setAttribute('onmouseenter','detailInfo('+'"'+location_detail+'"'+')');
    // path.setAttribute('onmouseleave','leave('+'"'+location_detail+'"'+')');
    if(isnormal){
        // path.setAttribute('fill',"rgba(44,246,165,1)");
        path.setAttribute('fill',"rgba(44,246,165,1)");
        svg.setAttribute("id","svg_nomal")

    }else{
        path.setAttribute('fill',"#f00");
        svg.setAttribute("id","svg_unnomal")
    }
    path.setAttribute('p-id',"3995")
    path.appendChild(animate1)
    path.appendChild(animate2)
    var script = SCRIPT_NOMLOCATION;
    insertscript(svg,script)
    svg.appendChild(defs)
    svg.appendChild(path)
    svg.setAttribute("class","newadd")
    return svg;
}

// Delete old elements
function deleteoldsvg(){
    console.log("delete old svg")
    var oldsvg = document.getElementsByClassName("newadd")
    console.log(oldsvg.length);
    console.log("!!!!!",oldsvg);
    console.log(oldsvg.length);
    while(oldsvg[0]){
      oldsvg[0].remove();
    }
}

// Insert stript into the element
function insertscript(svg,script){
    var html = script;
    var cont = svg;
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = html;
    cont.appendChild(newScript);
}
</script>

<style scoped lang="less">
.input-with-select {
  width: 50%;
  /* font-size: 15px; */
}
.myForm {
  margin: 10px auto; /* Form centering settings */
  padding: 40px 60px;
  width: 70%;
  // background: lightgray;
  // color: #606266;
  border: 3px solid #00B4D8;
  border-radius: 10px;
}

.el-table {
  font-size: 15px;
  color: #232324;
}

/deep/ .el-form-item__label {
  font-size: 15px;
  color: #232324;
}
/* .el-select {
  width: 60%;
} */

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
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#e6f0ef', endColorstr='#b4ede7',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
}

.el-form-item {
  border-top: 1px solid #ebeef5; // Table line color
  margin-bottom: 0;
}

.el-form-item:not(:nth-child(6)) /deep/ .el-form-item__label {
  border-right: 1px solid #ebeef5;
}

// /deep/ is equivalent to >>>
/deep/ .el-checkbox__inner:hover {
  background-color: rgb(115, 200, 200) !important;
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
  border-color: rgb(115, 200, 200) !important;
  font-size: 15px;
  color: #232324;
}
/deep/ .el-select .el-input__inner:focus {
  border-color: rgb(115, 200, 200);
}

.el-select {
  margin-left: 10px;
}

.el-select-dropdown__item.selected {
  color: rgb(115, 200, 200);
}

.el-select-dropdown__item {
  text-align: center;
  text-indent: 0;
}
.svgbox{
  margin-top: 100px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  width: 700px;
}
.el-table {
  font-size: 15px;
  color: #232324;
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
  border: solid 1px #0E3EDA;
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
// /deep/ will report an error with ::v-deep
:v-deep .el-form-item__label {
  float: none; // Cancel label left float
  word-break: break-word; // Support word truncation line feed
}
::v-deep .el-table__expand-icon{
 -webkit-transform: rotate(0deg);
 transform: rotate(0deg);
}
</style>