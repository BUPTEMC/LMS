    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '项目名称',
                title: '项目名称',
                align: 'center'
            }, {
                field: '停止原因',
                title: '停止原因',
                align: 'center'
            }]
        });
    });