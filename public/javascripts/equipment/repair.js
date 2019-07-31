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
            field: '送修人员',
            title: '送修人员',
            align: 'center'
        }, {
            field: '申请维修时间',
            title: '申请维修时间',
            align: 'center'
        }, {
            field: '维修原因',
            title: '维修原因',
            align: 'center'
        }, {
            field: '技术负责人意见',
            title: '技术负责人意见',
            align: 'center'
        }, {
            field: '不同意原因',
            title: '不同意原因',
            align: 'center'
        }, {
            field: '实验室主任意见',
            title: '实验室主任意见',
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
            field: '送修人员',
            title: '送修人员',
            align: 'center'
        }, {
            field: '送修时间',
            title: '送修时间',
            align: 'center'
        }, {
            field: '送回时间',
            title: '送回时间',
            align: 'center'
        }, {
            field: '维修原因',
            title: '维修原因',
            align: 'center'
        }, {
            field: '验收结果',
            title: '验收结果',
            align: 'center'
        }, {
            field: '验收人员',
            title: '验收人员',
            align: 'center'
        }]
    });
});