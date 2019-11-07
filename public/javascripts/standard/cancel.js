    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '标准编号',
                title: '标准编号',
                align: 'center'
            }, {
                field: '标准名称',
                title: '标准名称',
                align: 'center'
            }, {
                field: '发布日期',
                title: '发布日期',
                align: 'center'
            }, {
                field: '实施日期',
                title: '实施日期',
                align: 'center'
            }, {
                field: '作废日期',
                title: '作废日期',
                align: 'center'
            }, {
                field: '状态',
                title: '状态',
                align: 'center'
            }]
        });
    });