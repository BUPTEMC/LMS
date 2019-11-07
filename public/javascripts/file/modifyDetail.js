    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '新文件编号',
                title: '新文件编号',
                align: 'center'
            }, {
                field: '文件名称',
                title: '文件名称',
                align: 'center'
            }, {
                field: '申请人',
                title: '申请人',
                align: 'center'
            }, {
                field: '审核人',
                title: '审核人',
                align: 'center'
            }, {
                field: '审核意见',
                title: '审核意见',
                align: 'center'
            }]
        });
    });