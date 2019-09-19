    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '检查日期',
                title: '检查日期',
                align: 'center'
            }, {
                field: '监督员',
                title: '监督员',
                align: 'center'
            }, {
                field: '详情',
                title: '详情',
                align: 'center'
            }]
        });
    });