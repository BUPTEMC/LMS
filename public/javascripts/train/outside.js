    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '培训名称',
                title: '培训名称',
                align: 'center'
            }, {
                field: '培训单位',
                title: '培训单位',
                align: 'center'
            }, {
                field: '开始日期',
                title: '开始日期',
                align: 'center'
            }, {
                field: '结束日期',
                title: '结束日期',
                align: 'center'
            }, {
                field: '操作',
                title: '操作',
                align: 'center'
            }]
        });
    });