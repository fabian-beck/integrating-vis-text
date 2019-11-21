class FigureIntroIllustrating {

    constructor() {
        const svg = d3.select('svg');
        svg.append('rect')
            .attr('x', 80)
            .attr('y', 10)
            .attr('width', 800)
            .attr('height', 70)
            .attr('class', 'textbox');
    }

}