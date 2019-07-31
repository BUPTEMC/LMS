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
                field: '规格型号',
                title: '规格型号',
                align: 'center'
            }, {
                field: '出厂编号',
                title: '出厂编号',
                align: 'center'
            }, {
                field: '制造商',
                title: '制造商',
                align: 'center'
            }, {
                field: '估价',
                title: '估价',
                align: 'center'
            }, {
                field: '报废原因',
                title: '报废原因',
                align: 'center'
            }, {
                field: '申请日期',
                title: '申请日期',
                align: 'center'
            }, {
                field: '综合管理部主管意见',
                title: '综合管理部主管意见',
                align: 'center'
            }, {
                field: '不同意原因',
                title: '不同意原因',
                align: 'center'
            }]
        });
    });