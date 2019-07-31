$(document).ready(function() {
    $('#tablepage').bootstrapTable({
        columns: [ 
        {
            field: 'number',
            title: '序号',
            align: 'center'
        },{
            field: '规格型号',
            title: '规格型号',
            align: 'center'
        }, {
            field: '出厂编号',
            title: '出厂编号',
            align: 'center'
        }, {
            field: '计划校准日期',
            title: '计划校准日期',
            align: 'center'
        }, {
            field: '实际校准日期',
            title: '实际校准日期',
            align: 'center'
        }, {
            field: '校准结果',
            title: '校准结果',
            align: 'center'
        }, {
            field: '是否合格',
            title: '是否合格',
            align: 'center'
        }, {
            field: '校准证书编号',
            title: '校准证书编号',
            align: 'center'
        }, {
            field: '校准证书下载',
            title: '校准证书下载',
            align: 'center'
        }, {
            field: '检定周期',
            title: '检定周期',
            align: 'center'
        }, {
            field: '仪器检定单位',
            title: '仪器检定单位',
            align: 'center'
        }, {
            field: '仪器检定单位修改原因',
            title: '单位修改原因...',
            titleTooltip:'仪器检定单位修改原因',
            align: 'center'
        }, {
            field: '仪器检定单位修改评定说明',
            title: '单位修改说明...',
            titleTooltip:'仪器检定单位修改评定说明',
            align: 'center'
        }, {
            field: '记录编写日期',
            title: '记录编写日期',
            align: 'center'
        }]
    });
});
// 规格精度
function accuracy(accuracyItem,accuracyRange){
    $("#adjustItem_tbody").empty();  
    document.getElementById('adjustItem').style.display='block';
    var accuracyitem = accuracyItem.split(",");
    var accuracyrange = accuracyRange.split(",");
    var name="";
    for(var i = 0; i < accuracyitem.length; i++){
        name += "<tr><td>" + accuracyitem[i] + "</td><td>" + accuracyrange[i] + "</td></tr>"
    }
    document.getElementById("adjustItem_tbody").insertAdjacentHTML("beforeEnd",name);
}