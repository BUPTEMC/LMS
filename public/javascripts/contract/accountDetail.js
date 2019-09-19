$(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '到账时间',
                title: '到账时间',
                align: 'center'
            }, {
                field: '到账金额',
                title: '到账金额',
                align: 'center'
            }, {
                field: '汇款单位',
                title: '汇款单位',
                align: 'center'
            }, {
                field: '操作',
                title: '操作',
                align: 'center'
            }]
        });
    });