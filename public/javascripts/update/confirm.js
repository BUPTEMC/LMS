    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '变更前的标准名称及编号',
                title: '变更前的标准名称及编号',
                align: 'center'
            }, {
                field: '查新人员',
                title: '查新人员',
                align: 'center'
            }, {
                field: '提交日期',
                title: '提交日期',
                align: 'center'
            }, {
                field: '技术负责人',
                title: '技术负责人',
                align: 'center'
            }, {
                field: '审核日期',
                title: '审核日期',
                align: 'center'
            }, {
                field: '审核意见',
                title: '审核意见',
                align: 'center'
            }, {
                field: '备注',
                title: '备注',
                align: 'center'
            }]
        });
    });