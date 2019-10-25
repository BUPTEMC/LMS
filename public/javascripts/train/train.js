    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '编号',
                title: '编号',
                align: 'center'
            }, {
                field: '名称',
                title: '名称',
                align: 'center'
            }, {
                field: '类型',
                title: '类型',
                align: 'center'
            }, {
                field: '日期',
                title: '日期',
                align: 'center'
            }]
        });
    });