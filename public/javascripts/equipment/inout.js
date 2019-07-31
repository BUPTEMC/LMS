    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [{
                field: '设备编号',
                title: '设备编号',
                align: 'center'
            }, {
                field: '设备名称',
                title: '设备名称',
                align: 'center'
            }, {
                field: '取走设备时间',
                title: '取走设备时间',
                align: 'center'
            }, {
                field: '取走原因',
                title: '取走原因',
                align: 'center'
            }, {
                field: '领取人',
                title: '领取人',
                align: 'center'
            }, {
                field: '归还人',
                title: '归还人',
                align: 'center'
            },{
                field: '设备管理员',
                title: '设备管理员',
                align: 'center'
            }, {
                field: '归还时间',
                title: '归还时间',
                align: 'center'
            }, {
                field: '归还时状态',
                title: '归还时状态',
                align: 'center'
            }, {
                field: '验收人员',
                title: '验收人员',
                align: 'center'
            }, {
                field: '备注',
                title: '备注',
                align: 'center'
            }]
        });
    });
function inout(length) {
    if(length == 0){
        var ret_herf = document.getElementById("ret_herf");
        var ret_button = document.getElementById("ret_button");
        ret_herf.parentNode.removeChild(ret_herf);
        ret_button.parentNode.removeChild(ret_button);
        var part_0 = "<button type='button' class='btn btn-link disabled' id='ret_button' tabindex='-1'>仪器设备归还登记</button>"
        document.getElementById("in").insertAdjacentHTML("beforeEnd",part_0);
    }
}