$(document).ready(function() {
    $('#table_page').bootstrapTable({
        columns: [
        {
            field: '设备编号',
            title: '设备编号',
            align: 'center'
        }, {
            field: '设备名称',
            title: '设备名称',
            align: 'center'
        }, {
            field: '规格型号',
            title: '规格型号',
            align: 'center'
        }, {
            field: '出厂编号',
            title: '出厂编号',
            align: 'center'
        }, {
            field: '原证书编号',
            title: '原证书编号',
            align: 'center'
        }, {
            field: '原有效期',
            title: '原有效期',
            align: 'center'
        }, {
            field: '校准机构',
            title: '校准机构',
            align: 'center'
        }, {
            field: '计划校准时间',
            title: '计划校准时间',
            align: 'center'
        }, {
            field: '检定周期',
            title: '检定周期',
            align: 'center'
        },  {
            field: '计划编写日期',
            title: '计划编写日期',
            align: 'center'
        },  {
            field: '校准原因',
            title: '校准原因',
            align: 'center'
        },  {
            field: '校准内容',
            title: '校准内容',
            align: 'center'
        }, {
            field: '技术负责人意见',
            title: '意见...',
            titleTooltip:'技术负责人意见',
            align: 'center'
        }, {
            field: '不同意原因',
            title: '不同意原因',
            align: 'center'
        }]
    });
});
$(document).ready(function() {
    $('#table_page2').bootstrapTable({
        columns: [
        {
            field: '设备编号',
            title: '设备编号',
            align: 'center'
        }, {
            field: '设备名称',
            title: '设备名称',
            align: 'center'
        }, {
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