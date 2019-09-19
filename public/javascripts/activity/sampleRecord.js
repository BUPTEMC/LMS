    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '活动编号',
                title: '活动编号',
                align: 'center'
            }, {
                field: '活动名称',
                title: '活动名称',
                align: 'center'
            }, {
                field: '申请人',
                title: '申请人',
                align: 'center'
            }, {
                field: '委托方名称',
                title: '委托方名称',
                align: 'center'
            }, {
                field: '项目名称',
                title: '项目名称',
                align: 'center'
            }, {
                field: '申请时间',
                title: '申请时间',
                align: 'center'
            }, {
                field: '技术负责人',
                title: '技术负责人',
                align: 'center'
            }, {
                field: '意见',
                title: '意见',
                align: 'center'
            }, {
                field: '不同意原因',
                title: '不同意原因',
                align: 'center'
            }]
        });
    });