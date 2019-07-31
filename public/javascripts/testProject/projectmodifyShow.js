    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '项目名称',
                title: '项目名称',
                align: 'center'
            }, {
                field: '申请人',
                title: '申请人',
                align: 'center'
            }, {
                field: '调整情况',
                title: '调整情况',
                align: 'center'
            }, {
                field: '调整内容',
                title: '调整内容',
                align: 'center'
            }, {
                field: '调整原因',
                title: '调整原因',
                align: 'center'
            }, {
                field: '申请时间',
                title: '申请时间',
                align: 'center'
            }, {
                field: '实验室主任',
                title: '实验室主任',
                align: 'center'
            }, {
                field: '主任意见',
                title: '主任意见',
                align: 'center'
            }, {
                field: '不同意原因',
                title: '不同意原因',
                align: 'center'
            }]
        });
    });