    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '合同编号',
                title: '合同编号',
                align: 'center'
            }, {
                field: '委托单位',
                title: '委托单位',
                align: 'center'
            }, {
                field: '项目名称',
                title: '项目名称',
                align: 'center'
            }, {
                field: '状态',
                title: '状态',
                align: 'center'
            }, {
                field: '操作',
                title: '操作',
                align: 'center'
            }]
        });
    });