    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '预防措施编号',
                title: '预防措施编号',
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