$(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '测试报告编号',
                title: '测试报告编号编号',
                align: 'center'
            }, {
                field: '申请人',
                title: '申请人',
                align: 'center'
            }, {
                field: '技术负责人',
                title: '技术负责人',
                align: 'center'
            }, {
                field: '意见',
                title: '意见',
                align: 'center'
            }, {
                field: '不同意原因',
                title: '不同意原因',
                align: 'center'
            }, {
                field: '实验室主任',
                title: '实验室主任',
                align: 'center'
            }, {
                field: '实验室主任意见',
                title: '意见',
                align: 'center'
            }, {
                field: '不同意原因',
                title: '不同意原因',
                align: 'center'
            }]
        });
    });