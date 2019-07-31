$(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '申请人',
                title: '申请人',
                align: 'center'
            }, {
                field: '申请时间',
                title: '申请时间',
                align: 'center'
            }, {
                field: '测试技术部主管',
                title: '测试技术部主管',
                align: 'center'
            }, {
                field: '测试技术部主管意见',
                title: '意见',
                align: 'center'
            }, {
                field: '技术负责人',
                title: '技术负责人',
                align: 'center'
            }, {
                field: '技术负责人意见',
                title: '意见',
                align: 'center'
            }]
        });
    });