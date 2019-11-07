    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '方法确认编号',
                title: '方法确认编号',
                align: 'center'
            }, {
                field: '方法确认名称',
                title: '方法确认名称',
                align: 'center'
            }, {
                field: '创建人',
                title: '创建人',
                align: 'center'
            }, {
                field: '技术负责人意见',
                title: '技术负责人意见',
                align: 'center'
            }]
        });
    });