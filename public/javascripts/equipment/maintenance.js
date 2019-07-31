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
            field: '保养人员',
            title: '保养人员',
            align: 'center'
        }, {
            field: '保养时间',
            title: '保养时间',
            align: 'center'
        }, {
            field: '保养内容',
            title: '保养内容',
            align: 'center'
        }, {
            field: '备注',
            title: '备注',
            align: 'center'
        }]
    });
});