    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '不符合项编号',
                title: '不符合项编号',
                align: 'center'
            }, {
                field: '不符合项来源',
                title: '不符合项来源',
                align: 'center'
            }, {
                field: '创建人',
                title: '创建人',
                align: 'center'
            }, {
                field: '创建日期',
                title: '创建日期',
                align: 'center'
            }, {
                field: '状态',
                title: '状态',
                align: 'center'
            }]
        });
    });