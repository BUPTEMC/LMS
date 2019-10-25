    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '原始记录编号',
                title: '原始记录编号',
                align: 'center'
            }, {
                field: '原始记录名称',
                title: '原始记录名称',
                align: 'center'
            }, {
                field: '测试日期',
                title: '测试日期',
                align: 'center'
            }, {
                field: '质量监督',
                title: '质量监督',
                align: 'center'
            }, {
                field: '质量监督情况',
                title: '质量监督情况',
                align: 'center'
            }, {
                field: '测试报告',
                title: '测试报告',
                align: 'center'
            }, {
                field: '测试报告情况',
                title: '测试报告情况',
                align: 'center'
            }]
        });
    });