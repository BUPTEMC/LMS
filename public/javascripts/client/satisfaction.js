    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '调查编号',
                title: '调查编号',
                align: 'center'
            }, {
                field: '合同编号',
                title: '合同编号',
                align: 'center'
            }, {
                field: '合同名称',
                title: '合同名称',
                align: 'center'
            }, {
                field: '客户满意度',
                title: '客户满意度',
                align: 'center'
            }]
        });
    });