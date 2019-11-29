    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '期间核查编号',
                title: '期间核查编号',
                align: 'center'
            }, {
                field: '期间核查名称',
                title: '期间核查名称',
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